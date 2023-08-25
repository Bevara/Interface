function show_reports(){
	const preview = document.getElementById('canvas');
	if (preview){
		preview.reports = true;
	}
}

function disable_reports(){
	const preview = document.getElementById('canvas');
	if (preview){
		preview.reports = false;
	}
}

function show_graph(){
	const preview = document.getElementById('canvas');
	const graph = document.getElementById('graph');
	if (preview && graph){
		graph.innerHTML = preview.connections;
	}
}