import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Pokemon, PokemonService } from 'src/app/http/requests/pokemon/pokemon.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, from, Observable, map } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { UtilityService } from 'src/app/services/utility.service';
import { ItemsService } from 'src/app/http/requests/items/items.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CrudTeamPokemonDialogService } from './crud-team-pokemon-dialog.service';
@Component({
  selector: 'comp-crud-team-pokemon-dialog',
  templateUrl: './crud-team-pokemon-dialog.component.html',
  styleUrls: ['./crud-team-pokemon-dialog.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, CommonModule, MatButtonModule] // Ajouter CommonModule ici
})
export class CrudTeamPokemonDialogComponent implements OnInit {

  @Output() teamPokemonSubmitted: EventEmitter<any> = new EventEmitter<any>();

  pokemons: any[] = [];
  filteredPokemons: Observable<any[]> = new Observable();
  isPokemonLoaded: boolean = false;
  pokemon: any;
  spread: string = '';
  isPokeChoosed: boolean = false;
  filteredMoves1: Observable<any[]> = new Observable();
  filteredMoves2: Observable<any[]> = new Observable();
  filteredMoves3: Observable<any[]> = new Observable();
  filteredMoves4: Observable<any[]> = new Observable();
  moves: any[] = [];
  form: FormGroup = new FormGroup({
    pokemon: new FormControl(),
    move1: new FormControl(),
    move2: new FormControl(),
    move3: new FormControl(),
    move4: new FormControl(),
    ability: new FormControl(),
    nature: new FormControl(),
    item: new FormControl(),
    hpStats: new FormControl(0),
    attStats: new FormControl(0),
    defStats: new FormControl(0),
    spAStats: new FormControl(0),
    spDStats: new FormControl(0),
    speStats: new FormControl(0),
  });

  items: any[] = [];
  filteredItems: Observable<any[]> = new Observable();
  abilities: any[] = [];
  filteredAbilities: Observable<any[]> = new Observable();
  filteredNatures: Observable<any[]> = new Observable();
  isSpreadSubmitted: boolean = false;
  natures: any[] = [];

  constructor(
    private crudTeamPokemonDialogService:CrudTeamPokemonDialogService, 
    private pokemonService: PokemonService, 
    private utilityService: UtilityService, 
    private itemsService: ItemsService, 
    private dialogRef: MatDialogRef<CrudTeamPokemonDialogComponent> 
  ) {}

  ngOnInit() {
    this.natures = this.crudTeamPokemonDialogService.getNatures();
    forkJoin([
      from(this.pokemonService.getPokemonsFromDB()),
      this.itemsService.fetchAndStoreItems()
    ]).subscribe(([pokemons, items]) => {
      this.items = items;
      this.pokemons = (pokemons as any[]).map((pokemon: any) => {
        const data = JSON.parse(pokemon.data);
        return {
          name: this.utilityService.capitalizeFirstLetter(pokemon.name),
          imageUrl: data.sprites.front_default,
          data 
        }
      });
      this.initEventForm();
      this.isPokemonLoaded = true;
    });
  }

  public getItem(itemName: string): any{
    const item = this.items.find(item => item.name === itemName);
    return item ? JSON.parse(item.data) : {};
  }

  public isValidItem(item: any): boolean {
    if(!item) return false;
    const items = this.items.map(item => item.name);
    return items.includes(item);
  }

  public isValidAbility(ability: any): boolean {
    if(!ability) return false;
    const abilities = this.abilities.map(ability => ability.name);
    return abilities.includes(ability);
  }

  public isValidMove(move: any): boolean {
    if(!move) return false;
    const moves = this.moves.map(move => move.name);
    return moves.includes(move);
  }

  public isSpreadValid(): boolean {
    const { hpStats, attStats, defStats, spAStats, spDStats, speStats } = this.form.value;
    return hpStats + attStats + defStats + spAStats + spDStats + speStats <= 510 && hpStats + attStats + defStats + spAStats + spDStats + speStats > 0;
  }

  onSelectionChange(event: any) {
    const name = event.option.value;
    this.pokemon = this.pokemons.find(pokemon => pokemon.name === name);
    this.moves = this.pokemon.data.moves.map((move: any) => ({ name: move.move.name, data: move }));
    this.abilities = this.pokemon.data.abilities.map((ability: any) => ({ name: ability.ability.name, data: ability }));
    this.isPokeChoosed = true;
  }

  onSpreadSubmit(){
    this.spread = this.crudTeamPokemonDialogService.formatSpread(this.form.value);
    if(this.isSpreadValid()){
      this.isSpreadSubmitted = true;
    }
  }

  onSubmit(){
    this.dialogRef.close({
      name: this.pokemon.name,
      data: {
        pokemon: this.pokemon,
        moves: [
          this.form.value.move1,
          this.form.value.move2,
          this.form.value.move3,
          this.form.value.move4,
        ],
        ability: this.form.value.ability,
        nature: this.form.value.nature,
        item: this.form.value.item,
      }
    });
    this.teamPokemonSubmitted.emit({
      name: this.pokemon.name,
      data: {
        moves: [
          this.form.value.move1,
          this.form.value.move2,
          this.form.value.move3,
          this.form.value.move4,
        ],
        ability: this.form.value.ability,
        nature: this.form.value.nature,
        item: this.form.value.item,
      }
    })
  }

  public isPokemonValid(): boolean{
    return this.isSpreadSubmitted && this.pokemon && this.isValidMove(this.form.get('move1')?.value) && this.isValidMove(this.form.get('move2')?.value)&& this.isValidMove(this.form.get('move3')?.value) && this.isValidMove(this.form.get('move4')?.value) && this.isValidItem(this.form.get('item')?.value) && this.isValidAbility(this.form.get('ability')?.value)
  }

  private initEventForm(){
    this.filteredNatures = this.form.get('nature')!.valueChanges.pipe(
      startWith(''),
      map(value => this.crudTeamPokemonDialogService._filterNatures(value, this.natures))
    );
    this.filteredPokemons = this.form.get('pokemon')!.valueChanges.pipe(
      startWith(''),
      map(value => this.crudTeamPokemonDialogService._filterPokemons(value, this.pokemons))
    );
    this.filteredAbilities = this.form.get('ability')!.valueChanges.pipe(
      startWith(''),
      map(value => this.crudTeamPokemonDialogService._filterAbilities(value, this.abilities))
    );
    this.filteredItems = this.form.get('item')!.valueChanges.pipe(
      startWith(''),
      map(value => this.crudTeamPokemonDialogService._filterItems(value, this.items))
    );
    this.filteredMoves1 = this.form.get('move1')!.valueChanges.pipe(
      startWith(''),
      map(value => this.crudTeamPokemonDialogService._filterMoves(value, this.moves))
    );
    this.filteredMoves2 = this.form.get('move2')!.valueChanges.pipe(
      startWith(''),
      map(value => this.crudTeamPokemonDialogService._filterMoves(value, this.moves))
    );
    this.filteredMoves3 = this.form.get('move3')!.valueChanges.pipe(
      startWith(''),
      map(value => this.crudTeamPokemonDialogService._filterMoves(value, this.moves))
    );
    this.filteredMoves4 = this.form.get('move4')!.valueChanges.pipe(
      startWith(''),
      map(value => this.crudTeamPokemonDialogService._filterMoves(value, this.moves))
    );
  }
}
