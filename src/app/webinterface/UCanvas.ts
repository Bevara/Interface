import JSZip = require("jszip");

class UniversalCanvas extends HTMLCanvasElement {
    using: string;
    memory: Uint8Array;

    with: string;

    entry: any;
    module: any;

    using_attribute: string = "";
    with_attribute: string[] = [];
    print_attribute: Element | null;
    error_attribute: Element | null;

    out = "mp4";
    scriptDirectory = document.currentScript? this.initScriptDirectory((document.currentScript as any).src) :"";
    script = null;
    core = null;
    src="";

    urlToRevoke = [];

    private _decodingPromise: Promise<string>;

    private initScriptDirectory(src:string){
        if (src.indexOf('blob:') !== 0) {
            return src.substr(0, src.replace(/[?#].*/, "").lastIndexOf('/')+1);
          } else {
            return '';
        }
    }
    

    get decodingPromise() {
        return this._decodingPromise;
    }

    get volume() {
        console.log("volume");
        return 0;
    }

    set volume(volume) {
        console.log("volume :" + volume);
    }

    set muted(muted) {
        console.log("muted :" + muted);
    }

    get muted() {
        console.log("muted ");
        return false;
    }

    play():void{
        console.log("play");
    }

    pause():void{
        console.log("pause");
    }

    load():void{
        console.log("load");
    }

    canPlayType(type: string): CanPlayTypeResult{
        return "";
    }

    processMessages(self, core, resolve) {
        function clear_text(text) {
            return text
                .replaceAll("[37m", '')
                .replaceAll("[0m", '');
        }

        if (core.print) {
            if (self.print_attribute) {
                (self.print_attribute as any).value += clear_text(core.print) + "\n";
            } else {
                console.log(core.print);
            }
        }

        if (core.printErr) {
            if (self.error_attribute) {
                (self.error_attribute as any).value += clear_text(core.printErr) + "\n";
            } else {
                console.log(core.printErr);
            }

        }

    }

    launchNoWorker(script, message, resolve) {
        const self = this;

        function addLoadEvent(script, func) {
            var oldonload = script.onload;
            if (typeof script.onload != 'function') {
                script.onload = func;
            } else {
                script.onload = function () {
                    if (oldonload) {
                        oldonload();
                    }
                    func();
                };
            }
        }

        function init() {
            if (window[self.core]){
                try{
                    (window as any)[self.core]({ data: message });
                    self.dispatchEvent(new CustomEvent('loadedmetadata'));
                }catch(error){
                    console.log(error.message);
                }
                
            }
        }

        const scripts = document.querySelectorAll(`script[src$="${script}"]`);

        if (scripts.length > 0) {
            const coreInit = (window as any)[self.core];
            if (coreInit) {
                init();
            } else {
                addLoadEvent(scripts[0], init);
            }
        } else {
            const script_elt = document.createElement('script');
            script_elt.src = script;
            addLoadEvent(script_elt, init);
            document.head.appendChild(script_elt);
            this.script = script_elt;
        }
    }

    async universal_decode(): Promise<string> {
        return new Promise(async (main_resolve, _main_reject) => {
            let mime = "";
            try{
                const parsed_url = new URL(this.src);
                if(parsed_url.protocol === 'blob:'){
                    // We can't fetch head of a blob
                    const response = await fetch(this.src);
                    mime = response.headers.get("Content-Type");
                }else if(parsed_url.protocol === 'http:' || parsed_url.protocol === 'https:'){
                    const response = await fetch(this.src, { method: 'HEAD' });
                    mime = response.headers.get("Content-Type");
                }
            }catch {
                console.log("failed to fetch head of the content "+ this.src);
            }



            let src = this.src;
            let js = null;
            let wasmBinaryFile = null;
            let dynamicLibraries: string[] = [];

            if (this.src.endsWith(".bvr") || mime == "application/x-bevara") {
                const jszip = new JSZip();
                const fetched_bvr = await fetch(this.src);

                if (!fetched_bvr.ok) {
                    main_resolve("");
                    return;
                }

                const zip = await jszip.loadAsync(fetched_bvr.blob());
                const metadata = await zip.file("meta.json").async("string");
                const json_meta = JSON.parse(metadata);
                this.core = json_meta.core;

                const getURLData = async (name) => {
                    if (Array.isArray(name)) {
                        const blobs = await Promise.all(name.map(x => zip.file(x).async("blob")));
                        const urls = blobs.map(x => URL.createObjectURL(x));
                        this.urlToRevoke = this.urlToRevoke.concat(urls);
                        return urls;
                    } else if (typeof name == 'string') {
                        const blob = await zip.file(name).async("blob");
                        const url = URL.createObjectURL(blob);
                        this.urlToRevoke.push(url);
                        return url;
                    }
                    return null;
                };

                src = (await getURLData(json_meta.source) as string);
                js = await getURLData(json_meta.core + ".js");
                wasmBinaryFile = await getURLData(json_meta.core + ".wasm");
                dynamicLibraries = (await getURLData(json_meta.decoders.map(x => x + ".wasm")) as string[]);
            }
            const scriptDirectory = this.getAttribute("script-directory") ? this.getAttribute("script-directory") : "";

            function addScriptDirectoryAndExtIfNeeded(url, ext) {
                try {
                    const parsed_url = new URL(url);
                    if (parsed_url.protocol === 'blob:') {
                        return url;
                    } else if (parsed_url.protocol === 'http:' || parsed_url.protocol === 'https:') {
                        return url + ext;
                    }
                    return scriptDirectory + url + ext;
                } catch (e) {
                    return scriptDirectory + url + ext;
                }
            }

            if (this.getAttribute("using")) {
                this.core = this.getAttribute("using");
                js = addScriptDirectoryAndExtIfNeeded(this.getAttribute("using"), ".js");
                wasmBinaryFile = addScriptDirectoryAndExtIfNeeded(this.getAttribute("using"), ".wasm");
            }

            if (this.getAttribute("js")) {
                //Overwrite js attribute
                js = addScriptDirectoryAndExtIfNeeded(this.getAttribute("js"), "");
            }

            if (this.getAttribute("with")) {
                dynamicLibraries = dynamicLibraries.concat(this.getAttribute("with").split(';').map(x => addScriptDirectoryAndExtIfNeeded(x, ".wasm")));
            }

            const message = {
                self:this,
                module: { 
                    dynamicLibraries: dynamicLibraries ,
                    canvas : document.getElementById("canvas"),
                    noInitialRun: true,
                    noExitRuntime: true

                },
                wasmBinaryFile: wasmBinaryFile,
                src: this.getAttribute("data-url"),
                useWebcodec: this.getAttribute("use-webcodec") == "",
                showStats: this.getAttribute("stats") == "",
                showGraph: this.getAttribute("graph") == "",
                showReport: this.getAttribute("report") == ""
            };

            if (!js){
                console.log("Warning! no accessor is used on the universal, using a usual tag instead...");
                main_resolve(this.src);
                return;
            }

            this.launchNoWorker(js, message, main_resolve);
        });
    }


    connectedCallback() {
        this.setAttribute("id", "canvas");
        this.src = this.getAttribute("data-url");
        this._decodingPromise = this.universal_decode();
    }

    disconnectedCallback() {
        this.urlToRevoke.forEach(x => URL.revokeObjectURL(x));

        if (this.script) {
            const core = this.getAttribute("using");
            document.head.removeChild(this.script);
            this.script = null;
            if ((window as any)[core]) {
                (window as any)[core] = null;
            }

        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        switch (name) {
            case 'src':
                break;
            case 'using':
                this.using_attribute = this.getAttribute("using");
                break;
            case 'with':
                this.with_attribute = this.getAttribute("with").split(';').map(x => x + ".wasm");
                break;
            case 'print':
                this.print_attribute = document.querySelector(this.getAttribute("print"));
                break;
            case 'printerr':
                this.error_attribute = document.querySelector(this.getAttribute("printerr"));
                break;
            case 'out':
                this.out = this.getAttribute("out");
                break;
            case 'script-directory':
                this.scriptDirectory = this.getAttribute("script-directory");
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with', 'print', 'printerr', 'out', 'progress', 'script-directory', "debug", "js", "use-webcodec"]; }
}

if (!customElements.get('universal-canvas')) {
    customElements.define('universal-canvas', UniversalCanvas, {extends: 'canvas' });
}

export { UniversalCanvas };