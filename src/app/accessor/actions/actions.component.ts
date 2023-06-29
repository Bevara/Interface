import { Component } from '@angular/core';
import { AccessorsService } from 'src/app/services/accessors.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin,Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  showModal = false;

  constructor(public accessorsService : AccessorsService,
    private http: HttpClient) { }

    private download_libs(){
      const all_libs = this.accessorsService.libraries.concat(this.accessorsService.using);
      return all_libs.map(lib => 
        ({name:lib.url.substring(lib.url.lastIndexOf('/')+1), blob:this.http.get(lib.url, {
          responseType: 'blob'
        })}));
    }

    private send_zip(content:Blob){
      const a = document.getElementById('exportLink');
      if (a) {
        a.setAttribute('href', URL.createObjectURL(content));
        a.setAttribute(
          'download',
          'libs.zip'
        );
        const event = new MouseEvent('click', {
          view: window
        });
        a.dispatchEvent(event);
      }
    }
  
    public zip_libraries(){
      const zip = new JSZip();
  
      const all_libs = this.download_libs();
  
        return forkJoin(
          all_libs.map(x => x.blob)
        ).subscribe(
          wasms=>{
            all_libs.forEach((lib,i)=> zip.file(lib.name, wasms[i]));
            zip.generateAsync({type:"blob"}).then(content =>{
              this.send_zip(content);
            }
            );
          }
        );
    }
}
