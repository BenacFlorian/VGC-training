import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/http/requests/pokemon/pokemon.service';
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
@Component({
  selector: 'comp-crud-team-pokemon-dialog',
  templateUrl: './crud-team-pokemon-dialog.component.html',
  styleUrls: ['./crud-team-pokemon-dialog.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, CommonModule, MatButtonModule] // Ajouter CommonModule ici
})
export class CrudTeamPokemonDialogComponent implements OnInit {
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
  constructor(private pokemonService: PokemonService, private utilityService: UtilityService, private itemsService: ItemsService) {}

  ngOnInit() {
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

  private _filterPokemons(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(filterValue));
  }
  private _filterMoves(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.moves.filter(move => move.name.toLowerCase().includes(filterValue));
  }
  private _filterItems(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.items.filter(item => item.name.toLowerCase().includes(filterValue));
  }

  public isValidItem(item: any): boolean {
    if(!item) return false;
    const items = this.items.map(item => item.name);
    return items.includes(item);
  }

  public isValidMove(move: any): boolean {
    if(!move) return false;
    const moves = this.moves.map(move => move.name);
    return moves.includes(move);
  }

  public isSpreadValid(): boolean {
    const { hpStats, attStats, defStats, spAStats, spDStats, speStats } = this.form.value;
    return hpStats + attStats + defStats + spAStats + spDStats + speStats > 510;
  }

  onSelectionChange(event: any) {
    console.log(event);
    const name = event.option.value;
    this.pokemon = this.pokemons.find(pokemon => pokemon.name === name);
    this.moves = this.pokemon.data.moves.map((move: any) => ({ name: move.move.name, data: move }));
    this.isPokeChoosed = true;
  }

  onSubmit(){
    this.spread = this.formatSpread(this.form.value)
    console.log(this.form.value);
  }

  private formatSpread(spread: any): string{
    const hp = !!spread.hpStats && spread.hpStats != 0 ? `Hp: ${spread.hpStats}` : '';
    const att = !!spread.attStats && spread.attStats != 0 ? `Att: ${spread.attStats}` : '';
    const def = !!spread.defStats && spread.defStats != 0 ? `Def: ${spread.defStats}` : '';
    const spA = !!spread.spAStats && spread.spAStats != 0 ? `SpA: ${spread.spAStats}` : '';
    const spD = !!spread.spDStats && spread.spDStats != 0 ? `SpD: ${spread.spDStats}` : '';
    const spe = !!spread.speStats && spread.speStats != 0 ? `Spe: ${spread.speStats}` : '';
    return `${hp} ${att} ${def} ${spA} ${spD} ${spe}`;
  }

  private initEventForm(){

    this.filteredPokemons = this.form.get('pokemon')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPokemons(value))
    );
    this.filteredItems = this.form.get('item')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterItems(value))
    );
    this.filteredMoves1 = this.form.get('move1')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMoves(value))
    );
    this.filteredMoves2 = this.form.get('move2')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMoves(value))
    );
    this.filteredMoves3 = this.form.get('move3')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMoves(value))
    );
    this.filteredMoves4 = this.form.get('move4')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMoves(value))
    );
  }
}
