import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccessorsService } from './accessors.service';
import { forkJoin,Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class DownloaderService {

  constructor(
    private http: HttpClient,
    private accessorsService: AccessorsService
  ) { }


  private download_libs(){
    return this.accessorsService.libraries.map(lib => 
      ({name:lib.name, blob:this.http.get(lib.url, {
        responseType: 'blob'
      })}));
  }

  public get zip_libraries()/*: Observable<Blob>*/{
    const zip = new JSZip();

    const all_libs = this.download_libs();

      return forkJoin(
        all_libs.map(x => x.blob)
      ).subscribe(
        wasms=>{
          all_libs.forEach((lib,i)=> zip.file(lib.name, wasms[i]));
          zip.generateAsync({type:"blob"}).then(content =>{
            console.log(content);
          }
          );
        }
      );

      return "";
  }
}
