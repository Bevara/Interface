import { Component } from '@angular/core';
import { AccessorsService } from 'src/app/services/accessors.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin,Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as JSZip from 'jszip';
import { LibrariesService } from 'src/app/services/libraries.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  showModal = false;

  constructor(public accessorsService : AccessorsService,
    public librariesService : LibrariesService,
    private http: HttpClient) { }

    private download_libs(){
      const all_libs = this.accessorsService.libs.libraries.concat(this.accessorsService.libs.using);
      return all_libs.map(lib =>
        ({name:lib.url.substring(lib.url.lastIndexOf('/')+1), blob:this.http.get(lib.url, {
          responseType: 'blob'
        })}));
    }

    private download_scripts(){
      const all_scripts = this.accessorsService.tags.tagScripts;
      return {name:all_scripts.substring(all_scripts.lastIndexOf('/')+1), blob:this.http.get(all_scripts, {
          responseType: 'blob'
        })};
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
      const all_scripts = this.download_scripts();
      const all_downloads = all_libs.concat(all_scripts);

        return forkJoin(
          all_downloads.map(x => x.blob)
        ).subscribe(
          blob_contents=>{
            all_downloads.forEach((lib,i)=> zip.file(lib.name, blob_contents[i]));
            zip.generateAsync({type:"blob"}).then(content =>{
              this.send_zip(content);
            }
            );
          }
        );
    }
}
