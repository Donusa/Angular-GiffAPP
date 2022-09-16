import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../Interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey: string = "nKLnTWAa2b9HXFbTTp6ItziwU5WqpVg4";
  private _historial: string[] = [];
  private servicioUrl: string = "https://api.giphy.com/v1/gifs";
  
  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor( private http:HttpClient ){
    
    this._historial = JSON.parse(localStorage.getItem('Historial')! ) || [];
    this.resultados = JSON.parse(localStorage.getItem('UltimoResultado')!) || [];
  }


  buscarGifs( query:string = "" ){
    
    query = query.trim().toUpperCase();

    if(query.length>0 && !this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,9);

      localStorage.setItem('Historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
                    .set('api_key', this.apiKey)
                    .set('limit', '10')
                    .set('q', query);


    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})
      .subscribe((resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('UltimoResultado', JSON.stringify(this.resultados));
      })

      
  }
}
