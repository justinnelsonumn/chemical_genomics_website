///////////////////////////////////////////////////////////////
// Options for the script
///////////////////////////////////////////////////////////////
TABLE_CONTROL_DIV = "#table_control";
CHEMICAL_PICTURE_DIV = "#chemical_picture";
TABLE_DIV = "#tables";
//////////////////////////////////////////////////////////////
// Variables for the script
///////////////////////////
infoDataTable = "";
tables = []
tables.current = "";


///////////////
// Newest solution to keeping the data, all of the tables go into an array
// Table 0 is the chemicalInfo table, the rest are holding the raw data from the mysql search (basicDatabaseSearch.js)
///////////////////////////
tables[0] = {data:"", dataTable:"", tableDiv:"#chemicalInfo_table", div:"#info_control", type:"INFO", columns:[]}; // Chemical INFO
tables[1] = {data:"", dataTable:"", tableDiv:"#chemicalSGA_table", div:"#chemicalSGA_div", type:"SGA", columns:[]}; // Chemical SGA
tables[2] = {data:"", dataTable:"", tableDiv:"#chemicalGO_table", div:"#chemicalGO_div", type:"GO", columns:[]}; // Chemical GO
tables[2].columns = [ { "sType": "allnumeric", "aTargets": [5] } ];
tables[3] = {data:"", dataTable:"", tableDiv:"#chemicalGenetics_table", div:"#chemicalGenetics_div", type:"GEN", columns:[]}; // Chemical GEN
tables[3].columns = [ { "sType": "allnumeric", "aTargets": [2] } ];
tables[4] = {data:"", dataTable:"", tableDiv:"#parsons_table", div:"#parsons_div", type:"PARSONS", columns:[]}; // Parsons
tables[4].columns = [ { "sType": "allnumeric", "aTargets": [4, 5] } ];
tables[5] = {data:"", dataTable:"", tableDiv:"#chemicalComplex_table", div:"#chemicalComplex_div", type:"COM", columns:[]}; // Chemical COM
tables[5].columns = [ { "sType": "allnumeric", "aTargets": [4, 5] } ];
tables[6] = {data:"", dataTable:"", tableDiv:"#chemicalEnrichment_sens_table", div:"#chemicalEnrichment_sens_div", type:"ENR", columns:[]}; // Chemical ENR SENS
tables[6].columns = [ { "sType": "allnumeric", "aTargets": [4] } ];
tables[7] = {data:"", dataTable:"", tableDiv:"#chemicalEnrichment_resi_table", div:"#chemicalEnrichment_resi_div", type:"ENR", columns:[]}; // Chemical ENR RESI
tables[7].columns = [ { "sType": "allnumeric", "aTargets": [4] } ];
tables[8] = {data:"", dataTable:"", tableDiv:"#chemicalEnrichmentGO_sens_table", div:"#chemicalEnrichmentGO_sens_div", type:"ENRGO", columns:[]}; // Chemical ENR GO SENS
tables[8].columns = [ { "sType": "allnumeric", "aTargets": [10, 11, 12, 13, 14] } ];
tables[9] = {data:"", dataTable:"", tableDiv:"#chemicalEnrichmentGO_resi_table", div:"#chemicalEnrichmentGO_resi_div", type:"ENRGO", columns:[]}; // Chemical ENR GO RESI
tables[9].columns = [ { "sType": "allnumeric", "aTargets": [10, 11, 12, 13, 14] } ];
tables[10] = {data:"", dataTable:"", tableDiv:"#chemicalEnrichmentMC_sens_table", div:"#chemicalEnrichmentMC_sens_div", type:"ENRMC", columns:[]}; // Chemical ENR MC SENS
tables[10].columns = [ { "sType": "allnumeric", "aTargets": [8] } ];
tables[11] = {data:"", dataTable:"", tableDiv:"#chemicalEnrichmentMC_resi_table", div:"#chemicalEnrichmentMC_resi_div", type:"ENRMC", columns:[]}; // Chemical ENR MC RESI
tables[11].columns = [ { "sType": "allnumeric", "aTargets": [8] } ];

tables[12] = {data:"", dataTable:"", tableDiv:"#chemicalSimilarity_table", div:"#chemicalSimilarity_div", type:"SIMI", columns:[]}; // Chemical ENR MC RESI
tables[12].columns = [ { "sType": "allnumeric", "aTargets": [] } ];
tables[13] = {data:"", dataTable:"", tableDiv:"#profileSimilarity_table", div:"#profileSimilarity_div", type:"SIMI", columns:[]}; // Chemical ENR MC RESI
tables[13].columns = [ { "sType": "allnumeric", "aTargets": [] } ];

/////////////////////////////////////////////////
// Functions to be run when this script is loaded
/////////////////////////

$(window).resize(function() {
	if(this.resizeTO) clearTimeout(this.resizeTO);
	this.resizeTO = setTimeout(function() {
		tables[index].dataTable.fnAdjustColumnSizing()
		//$(this).trigger('resizeEnd');
	}, 100);
});

///////////////////////////////////////////////////////////////
// loadScatterplots(index)
// showScatterplots()
// hideScatterPlots()
// These functions control the scatterplots
////////////////////////////////////////////////
function loadScatterplots(index){
	str = '';
	if(index != 'ALL'){
		pic_prefix = 'scatterplots/'+tables[0].data[index]['lane']+'/'+tables[0].data[index]['pic_num'];
		str = str + '<img src="'+pic_prefix+'_0.png"><br>';
		str = str + '<img src="'+pic_prefix+'_1.png"><br>';
		str = str + '<img src="'+pic_prefix+'_2.png"><br>';
		str = str + '<img src="'+pic_prefix+'_3.png">';
	}
	$("#scatterplots").html(str);
}
function showScatterplots(){
	destroyCurrentTable();
	tables.current = "";
	hideAllTableDivs();
	$("#scatterplots").show();
}

function hideScatterPlots(){
	$("#scatterplots").hide();
}
///////////////////////////////////////////////////////////////
// loadResults (override basicDatabaseSearch:loadResults)
// unloadResults
// This function will handle the results from a database search
// It will execute checkFunction to check to see if the results are good before loading them in
////////////////////////////////////////////////
function loadResults(results, checkFunction){
	for(var i=0; i<tables.length; i++){
		if(!checkFunction(results[i])){ tables[i].data = results[i];}
	}
}

function unloadResults(){
	for(var i=0; i<tables.length; i++){
		tables[i].data = '';
	}
}

///////////////////////////////////////////////////////////////
// setupChemicalInfoTable (override basicDatabaseSearch:setupInfoTable)
// This function will setup the info table, which will then be used to control which data is displayed in other tables
//////////////////////////////////////////////
function setupChemicalInfoTable(){	
	destroyCurrentTable(); // Destroy the current data table
	unloadAllTableData(); // Clear the data currently in the dataTables including info table
	hideAllTableDivs(); // Hide the data tables
	destroyTable(0); // Destroy the DataTable for the chemical info
	loadChemicalInfoTable(0); // 0 is the index for the info table
	tables[0].dataTable = convertToDataTable(0, '400px');
	showTable(0); // Show the info table
	fixDataTableHeader(0); // Make sure the header is properly aligned
	showTableControls();
	setupInfoTableClick(0);
}
//////////////
// LoadChemicalInfoTable
// Load in the actual data data into the table
//////////////////////
function loadChemicalInfoTable(index){
	str = ''; // Start Creating the table

	// Manually include an all
	str = str + '<tr name="all"><td name="chemicalName">ALL</td><td name="chemicalMultiplex">ALL</td><td name="lane">ALL</td><td name="replicate">ALL</td></tr>';

	// Create Table
	curIndex = 0;
	for (var i in tables[index].data){
		str = str + '<tr name="'+curIndex+'">';
			//str = str + '<td name="structure" align="center">' + "<img src='structures/" + tables[index].data[i].structure_pic +"' height='100px' width='100px' /></td>";
			str = str + '<td name="chemicalName">' + tables[index].data[i].chemical_name + '</td>';
			str = str + '<td name="chemicalMultiplex">' + tables[index].data[i].chemical_multiplex + '</td>';
			str = str + '<td name="lane">' + tables[index].data[i].lane + '</td>';
			str = str + '<td name="replicate">' + tables[index].data[i].replicate + '</td>';
		str = str + '</tr>';
		curIndex = curIndex+1;
	}

	$(tables[index].tableDiv).find("tbody").html(str); // Throw down table
}
//////////////////////
// setupInfoTableClick
// This will set it up so that when the infoTable is clicked, additional data is loaded
function setupInfoTableClick(index){
	$(tables[index].tableDiv).find('tbody tr').click(function() {
		// Destroy the current table while I load in the new data
		tmp_currentTable = tables.current;
		destroyCurrentTable();
		// Load in the new Data
		var row_index = $(this).attr('name')
		if(row_index == "all"){
			loadChemicalPicture("");
			loadTableData("ALL", "ALL", "ALL", "ALL");
		} else {
			var chemicalName = tables[0].data[row_index].chemical_name;
			var chemicalMultiplex = tables[0].data[row_index].chemical_multiplex;
			var lane = tables[0].data[row_index].lane;
			var replicate = tables[0].data[row_index].replicate;
			var picture = tables[0].data[row_index].structure_pic;

			loadScatterplots(row_index);
			loadChemicalPicture(picture);
			loadTableData(chemicalName, chemicalMultiplex, lane, replicate);
			createTable(tmp_currentTable); // recreate the table that the website was on
		}
		$(this).addClass("selected").siblings().removeClass("selected");
	});
}

function createTable(index){
	destroyCurrentTable();
	tables.current = index;
	tables[index].dataTable = convertToDataTable(index, '500px');
	hideAllTableDivs();
	showTable(index);
	tables[index].dataTable.fnAdjustColumnSizing();
}


function setupSimilarityTableClick(index){
	$(tables[index].tableDiv).find('tbody tr').click(function() {
		var row_index = $(this).attr('name')
		basicDatabaseSearch(tables[index].data[row_index]['chemical2_name'])
	});
}
/////////////////////////
// LoadChemicalPicture
// loads up the chemical picture
//////////////////////
function loadChemicalPicture(picture){
	if(picture != ''){
		$(CHEMICAL_PICTURE_DIV).html("<img src='structures/"+picture+"' height='400px' width='400px' />");
	} else {
		$(CHEMICAL_PICTURE_DIV).html("");
	}
}

//////////////////////////////////////////////
// Load and unload Table Data
function loadTableData(chemical, multiplex, lane, replicate){
	for(var i=1; i<tables.length; i++){
		convert_toTable(i, chemical, multiplex, lane, replicate);
	}
}
// Destroy the data inside of the tables
function unloadAllTableData(){
	for(var i=1; i<tables.length; i++){
		unloadTableData(i);
	}
}
function unloadTableData(index){
	$(tables[index].tableDiv).find("tbody").html("");
}

///////////////////////////////////////////////////////////
// Fix columns
// Fixes the header of the dataTable
///////////////
function fixAllDataTableHeader(){
	for(var i=1; i<tables.length; i++){
		fixDataTableHeader(i);
	}
}
function fixDataTableHeader(index){
	tables[index].dataTable.fnAdjustColumnSizing();
}

/////////////////////////////////////////////////////////////////
// showTable()
// hideTable()
// Show or hide a table div based on what is loaded into the tables variable
// hideAllTableDivs()
// Hide all of the divs for the tables if they are shown.
/////////////////////////////////////////////////////////////////
function showTable(index){
	$(tables[index].div).show();
}
function hideTable(index){
	$(tables[index].div).hide();
}
function hideAllTableDivs(){
	for(var i=1; i<tables.length; i++){
		hideTable(i);
	}
	hideScatterPlots();
}
//////////////////////////////////////////////////////////////////
// showTableControls()
// hideTableControls
// Show or hide the table controls and the tables
function showTableControls(){
	$(TABLE_CONTROL_DIV).show();
	$(TABLE_DIV).show();
}
function hideTableControls(){
	$(TABLE_CONTROL_DIV).hide();
	$(TABLE_DIV).hide();
}
/////////////////////////////////////////////////////////////////
// convertToDataTable()
// converts an existing table into a datatable
//
function convertToDataTable(index, size){
	destroyTable(index);
	var dataTable = $(tables[index].tableDiv).dataTable({
		"sScrollY": size,
		"bPaginate": false,
		"bScrollCollapse": true,
		"bLengthChange": false,
		"bInfo": false,
		"aoColumnDefs": tables[index].columns,
	});

	$(tables[index].div).bind('resetColumnWidth', function () {dataTable.fnAdjustColumnSizing();});
	$(window).bind('resizeEnd', function () {dataTable.fnAdjustColumnSizing();});

	return dataTable;	
}
/////////////////////////////////////////////////////////////////////
//
// Create and destroy tables
//
function createTable(index){
	destroyCurrentTable();
	tables.current = index;
	tables[index].dataTable = convertToDataTable(index, '500px');
	hideAllTableDivs();
	showTable(index);
	tables[index].dataTable.fnAdjustColumnSizing()
}

function destroyTable(index){
	if(tables[index].dataTable != ""){
		if(tables[index].dataTable.html() != undefined){
			tables[index].dataTable.fnDestroy();
		}
		tables[index].dataTable = "";
	}
}
function destroyCurrentTable(){
	if(tables.current !== ""){
		destroyTable(tables.current);
		tables.current = "";
	}
}
function destroyAllTables(){
	for(var i=0; i<tables.length; i++){
		destroyTable(i);
	}
}

////////////////
// When the document is ready, load some custom sorting functions
// Sorting functions
/////////////
$(document).ready( function(){
	// new sorting functions 
	jQuery.fn.dataTableExt.oSort['allnumeric-asc']  = function(a,b) {
		if(a == "nan"){ return -1; }
		if(b == "nan"){ return 1; }
		var x = parseFloat(a);
		var y = parseFloat(b);
		return ((x < y) ? -1 : ((x > y) ?  1 : 0));
	};
	 
	jQuery.fn.dataTableExt.oSort['allnumeric-desc']  = function(a,b) {
		if(a == "nan"){ return -1; }
		if(b == "nan"){ return 1; }
		var x = parseFloat(a);
		var y = parseFloat(b);
		return ((x < y) ? 1 : ((x > y) ?  -1 : 0));
	};
});



////////////////////////////////////////////////////////////////////////
// convert_toTable(type, data, div, multiplex, lane, replicate)
// This controls which of the convert to tables to use based on type
//////////////////////////////////////////////
function convert_toTable(index, chemical, multiplex, lane, replicate){
	if(lane != "ALL"){ lane = 'lane'+lane;} // Minor Correction for sillyness in the database
	switch(tables[index].type) {
		case "SGA":
			convert_chemicalSGAtoTable(index, multiplex, lane, replicate);
			break;
		case "GO":
			convert_chemicalGOtoTable(index, multiplex, lane, replicate);
			break;
		case "GEN":
			convert_chemicalGeneticstoTable(index, multiplex, lane, replicate);
			break;
		case "PARSONS":
			convert_parsonstoTable(index, multiplex, lane, replicate);
			break;
		case "COM":
			convert_chemicalComplextoTable(index, multiplex, lane, replicate);
			break;
		case "ENR":
			convert_chemicalEnrichmenttoTable(index, multiplex, lane, replicate);
			break;
		case "ENRGO":
			convert_chemicalEnrichmentGOtoTable(index, multiplex, lane, replicate);
			break;
		case "ENRMC":
			convert_chemicalEnrichmentMCtoTable(index, multiplex, lane, replicate);
			break;
		case "SIMI":
			convert_similaritytoTable(index, chemical, multiplex, lane, replicate);
			break;
		default:
			break;
	}
}


///////////////////////////////////////////////
// These are all functions to load in the appropriate data into the tables
// Create the tables
///////////////////////////////////////////////
function convert_similaritytoTable(index, chemical, multiplex, lane, replicate){
	// Create table
	str = "";

	// Create Table
	for (var i in tables[index].data){
		if( (chemical == tables[index].data[i]['chemical1_name'] || chemical == "ALL") ){
			str = str + '<tr name="'+i+'">';
				str = str + '<td>'+tables[index].data[i]['chemical1_name']+'</td>';
				str = str + '<td>'+tables[index].data[i]['chemical2_name']+'</td>';
				str = str + '<td>'+tables[index].data[i]['score']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tables[index].tableDiv).find("tbody").html(str);
	setupSimilarityTableClick(index);
}
function convert_chemicalSGAtoTable(index, multiplex, lane, replicate){
	// Create table
	str = "";

	// Create Table
	for (var i in tables[index].data){
		if( (multiplex == tables[index].data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == tables[index].data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == tables[index].data[i]['replicate'])){
			str = str + '<tr>';
				str = str + '<td>'+tables[index].data[i]['chemical_name']+'</td>';
				//str = str + '<td>'+data[i]['chemical_multiplex']+'</td>';
				str = str + '<td>'+tables[index].data[i]['gene_common_name']+'</td>';
				//str = str + '<td>'+data[i]['correlation']+'</td>';
				str = str + '<td>'+tables[index].data[i]['p_value']+'</td>';
				//str = str + '<td>'+data[i]['lane']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tables[index].tableDiv).find("tbody").html(str);
}
function convert_chemicalGOtoTable(index, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in tables[index].data){
		if( (multiplex == tables[index].data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == tables[index].data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == tables[index].data[i]['replicate']) ){
			str = str + '<tr>';
				str = str + '<td>'+tables[index].data[i]['chemical_name']+'</td>';
				//str = str + '<td>'+data[i]['chemical_multiplex']+'</td>';
				str = str + '<td>'+tables[index].data[i]['GO_ID']+'</td>';
				//str = str + '<td>'+data[i]['GO_enrichment']+'</td>';
				str = str + '<td>'+tables[index].data[i]['GO_description']+'</td>';
				str = str + '<td>'+tables[index].data[i]['ratio_in_study']+'</td>';
				str = str + '<td>'+tables[index].data[i]['ratio_in_pop']+'</td>';
				//str = str + '<td>'+data[i]['p_uncorrected']+'</td>';
				str = str + '<td>'+tables[index].data[i]['p_bonferroni']+'</td>';
				//str = str + '<td>'+data[i]['p_holm']+'</td>';
				//str = str + '<td>'+data[i]['p_sidak']+'</td>';
				//str = str + '<td>'+data[i]['p_fdr']+'</td>';
				//str = str + '<td>'+data[i]['lane']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tables[index].tableDiv).find("tbody").html(str);
}
function convert_chemicalGeneticstoTable(index, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in tables[index].data){
		if( (multiplex == tables[index].data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == tables[index].data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == tables[index].data[i]['replicate']) ){
			str = str + '<tr>';
				//str = str + '<td>'+data[i]['AID']+'</td>';
				str = str + '<td>'+tables[index].data[i]['chemical_name']+'</td>';
				//str = str + '<td>'+data[i]['chemical_multiplex']+'</td>';
				//str = str + '<td>'+data[i]['chemical_weight']+'</td>';
				//str = str + '<td>'+data[i]['GID']+'</td>';
				str = str + '<td>'+tables[index].data[i]['gene_common_name']+'</td>';
				//str = str + '<td>'+data[i]['gene_barcode']+'</td>';
				//str = str + '<td>'+data[i]['gene_weight']+'</td>';
				str = str + '<td>'+tables[index].data[i]['score']+'</td>';
				//str = str + '<td>'+data[i]['lane']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tables[index].tableDiv).find("tbody").html(str);
}
function convert_parsonstoTable(index, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in tables[index].data){
		if( (multiplex == tables[index].data[i]['chemical1_multiplex'] || multiplex == tables[index].data[i]['chemical2_multiplex'] || multiplex == "ALL") && (lane == tables[index].data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == tables[index].data[i]['replicate']) ){
			str = str + '<tr>';
				str = str + '<td>'+tables[index].data[i]['chemical1_name']+'</td>';
				str = str + '<td>'+tables[index].data[i]['chemical1_multiplex']+'</td>';
				str = str + '<td>'+tables[index].data[i]['chemical2_name']+'</td>';
				str = str + '<td>'+tables[index].data[i]['chemical2_multiplex']+'</td>';
				str = str + '<td>'+tables[index].data[i]['correlation']+'</td>';
				str = str + '<td>'+tables[index].data[i]['p_value']+'</td>';
				str = str + '<td>'+tables[index].data[i]['lane']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tables[index].tableDiv).find("tbody").html(str);
}
function convert_chemicalComplextoTable(index, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in tables[index].data){
		if( (multiplex == tables[index].data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == tables[index].data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == tables[index].data[i]['replicate']) ){
			str = str + '<tr>';
				str = str + '<td>'+tables[index].data[i]['chemical_multiplex']+'</td>';
				str = str + '<td>'+tables[index].data[i]['chemical_name']+'</td>';
				str = str + '<td>'+tables[index].data[i]['complex_name']+'</td>';
				str = str + '<td>'+tables[index].data[i]['lane']+'</td>';
				str = str + '<td>'+tables[index].data[i]['z_score']+'</td>';
				str = str + '<td>'+tables[index].data[i]['number_genes_with_data']+'</td>';
				str = str + '<td>'+tables[index].data[i]['upload_date']+'</td>';
				str = str + '<td>'+tables[index].data[i]['cid']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tables[index].tableDiv).find("tbody").html(str);
}
function convert_chemicalEnrichmenttoTable(index, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in tables[index].data){
		if( (multiplex == tables[index].data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == tables[index].data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == tables[index].data[i]['replicate']) ){
			str = str + '<tr>';
				str = str + '<td>'+tables[index].data[i]['chemical_multiplex']+'</td>';
				str = str + '<td>'+tables[index].data[i]['chemical_name']+'</td>';
				str = str + '<td>'+tables[index].data[i]['gene_name']+'</td>';
				str = str + '<td>'+tables[index].data[i]['lane']+'</td>';
				str = str + '<td>'+tables[index].data[i]['p_value']+'</td>';
				str = str + '<td>'+tables[index].data[i]['upload_date']+'</td>';
				str = str + '<td>'+tables[index].data[i]['sensitivity_type']+'</td>';
				str = str + '<td>'+tables[index].data[i]['pid']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tables[index].tableDiv).find("tbody").html(str);
}
function convert_chemicalEnrichmentGOtoTable(index, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in tables[index].data){
		if( (multiplex == tables[index].data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == tables[index].data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == tables[index].data[i]['replicate']) ){
			str = str + '<tr>';
				str = str + '<td>'+tables[index].data[i]['GO_description']+'</td>';
				str = str + '<td>'+tables[index].data[i]['GO_enrichment']+'</td>';
				str = str + '<td>'+tables[index].data[i]['chemical_multiplex']+'</td>';
				str = str + '<td>'+tables[index].data[i]['chemical_name']+'</td>';
				str = str + '<td>'+tables[index].data[i]['enrichment_type']+'</td>';
				str = str + '<td>'+tables[index].data[i]['id']+'</td>';
				str = str + '<td>'+tables[index].data[i]['lane']+'</td>';
				str = str + '<td>'+tables[index].data[i]['num_genes']+'</td>';
				str = str + '<td>'+tables[index].data[i]['num_top_genes']+'</td>';
				str = str + '<td>'+tables[index].data[i]['overlap_genes']+'</td>';
				str = str + '<td>'+tables[index].data[i]['p_bonferroni']+'</td>';
				str = str + '<td>'+tables[index].data[i]['p_fdr']+'</td>';
				str = str + '<td>'+tables[index].data[i]['p_holm']+'</td>';
				str = str + '<td>'+tables[index].data[i]['p_sidak']+'</td>';
				str = str + '<td>'+tables[index].data[i]['p_uncorrected']+'</td>';
				str = str + '<td>'+tables[index].data[i]['pid']+'</td>';
				str = str + '<td>'+tables[index].data[i]['ratio_in_pop']+'</td>';
				str = str + '<td>'+tables[index].data[i]['ratio_in_study']+'</td>';
				str = str + '<td>'+tables[index].data[i]['sensitivity_type']+'</td>';
				str = str + '<td>'+tables[index].data[i]['upload_date']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tables[index].tableDiv).find("tbody").html(str);
}
function convert_chemicalEnrichmentMCtoTable(index, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in tables[index].data){
		if( (multiplex == tables[index].data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == tables[index].data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == tables[index].data[i]['replicate']) ){
			str = str + '<tr>';
				str = str + '<td>'+tables[index].data[i]['chemical_multiplex']+'</td>';
				str = str + '<td>'+tables[index].data[i]['chemical_name']+'</td>';
				str = str + '<td>'+tables[index].data[i]['enrichment_type']+'</td>';
				str = str + '<td>'+tables[index].data[i]['id']+'</td>';
				str = str + '<td>'+tables[index].data[i]['lane']+'</td>';
				str = str + '<td>'+tables[index].data[i]['num_genes']+'</td>';
				str = str + '<td>'+tables[index].data[i]['num_top_genes']+'</td>';
				str = str + '<td>'+tables[index].data[i]['overlap_genes']+'</td>';
				str = str + '<td>'+tables[index].data[i]['p_uncorrected']+'</td>';
				str = str + '<td>'+tables[index].data[i]['pid']+'</td>';
				str = str + '<td>'+tables[index].data[i]['sensitivity_type']+'</td>';
				str = str + '<td>'+tables[index].data[i]['upload_date']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tables[index].tableDiv).find("tbody").html(str);
}


////////////////////Working////////////////////////////////////
/*
// Info Table Controls
function adjustColumnsInfoDataTable(){
	infoDataTable.fnAdjustColumnSizing();
}
function unloadInfoTable(){
	$(infoDiv).find("table > tbody").html("");
}
function destroyInfoDataTable(){
	if(infoDataTable != ""){
		if(infoDataTable.html() != undefined){
			infoDataTable.fnDestroy();
		}
		infoDataTable = "";
	}
}

function setupInfoDataTable(){
	infoDataTable = initStandardDataTable(infoTableDiv, infoDiv, '200px');
}
/////////


// Showing and hiding of divs for controlling the tables
function showControls(){
	showInfoControls();
	showTableControls();
}
function hideControls(){
	hideInfoControls();
	hideTableControls();
}
function showInfoControls(){$(infoDiv).show();}
function hideInfoControls(){$(infoDiv).hide();}
function showTableControls(){$("#table_control").show();}
function hideTableControls(){$("#table_control").hide();}
/////////

// Load and unload Table Data
function loadTableData(multiplex, lane, replicate){
	for(var i=0; i<tables.length; i++){
		convert_toTable(tables[i].type, tables[i].data, tables[i].div, multiplex, lane, replicate);
		//tables[i].dataTable = initStandardDataTable(tables[i].tableDiv, tables[i].div);
	}
}
// Destroy the data inside of the tables
function unloadTableData(){
	for(var i=0; i<tables.length; i++){
		$(tables[i].div).find("table > tbody").html("");
		tables[i].data = "";
	}
}
/////////

// Create and destroy tables
function createTable(table_i){
	tables.current = table_i;
	tables[table_i].dataTable = initStandardDataTable(tables[table_i].tableDiv, tables[table_i].div, '500px', tables[table_i].columns);
}
function destroyTable(table_i){
	if(tables[table_i].dataTable != ""){
		if(tables[table_i].dataTable.html() != undefined){
			tables[table_i].dataTable.fnDestroy();
		}
		tables[table_i].dataTable = "";
	}
}
function destroyCurrentTable(){
	if(tables.current !== ""){
		destroyTable(tables.current);
		tables.current = "";
	}
}
function destroyAllTables(){
	for(var i=0; i<tables.length; i++){
		destroyTable(i);
	}
}


// This controls which of the convert to tables to use based on type
function convert_toTable(type, data, div, multiplex, lane, replicate){
	switch(type) {
		case "SGA":
			convert_chemicalSGAtoTable(data, div, multiplex, lane, replicate);
			break;
		case "GO":
			convert_chemicalGOtoTable(data, div, multiplex, lane, replicate);
			break;
		case "GEN":
			convert_chemicalGeneticstoTable(data, div, multiplex, lane, replicate);
			break;
		case "PARSONS":
			convert_parsonstoTable(data, div, multiplex, lane, replicate);
			break;
		case "COM":
			convert_chemicalComplextoTable(data, div, multiplex, lane, replicate);
			break;
		case "ENR":
			convert_chemicalEnrichmenttoTable(data, div, multiplex, lane, replicate);
			break;
		case "ENRGO":
			convert_chemicalEnrichmentGOtoTable(data, div, multiplex, lane, replicate);
			break;
		case "ENRMC":
			convert_chemicalEnrichmentMCtoTable(data, div, multiplex, lane, replicate);
			break;
		default:
			break;
	}

}

// Show the tables for the first time for this search
function showFirstTable(){
	showTable(tables[0].tableDiv);
	showControls()
	
}

// Hide all of the divs for the tables if they are shown.
function hideAllTableDivs(){
	for(var i=0; i<tables.length; i++){
		//$(tables[i].tableDiv).hide();
		$(tables[i].div).hide();
	}
}



// Show a specific table.
function showTable(table_i){
	destroyCurrentTable()
	createTable(table_i);

	hideAllTableDivs();
	$(tables[table_i].tableDiv).show();
	$(tables[table_i].div).show();
	$(tables[table_i].tableDiv).trigger('resetColumnWidth');
}

// Create the tables
function convert_chemicalSGAtoTable(data, tableDiv, multiplex, lane, replicate){
	// Create table
	str = "";

	// Create Table
	for (var i in data){
		if( (multiplex == data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == data[i]['replicate'])){
			str = str + '<tr>';
				str = str + '<td>'+data[i]['chemical_name']+'</td>';
				//str = str + '<td>'+data[i]['chemical_multiplex']+'</td>';
				str = str + '<td>'+data[i]['gene_common_name']+'</td>';
				//str = str + '<td>'+data[i]['correlation']+'</td>';
				str = str + '<td>'+data[i]['p_value']+'</td>';
				//str = str + '<td>'+data[i]['lane']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tableDiv).find("table > tbody").html(str);

	// Memorize the div for the table
	//chemicalSGA_TableDiv = tableDiv;
}
function convert_chemicalGOtoTable(data, tableDiv, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in data){
		if( (multiplex == data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == data[i]['replicate']) ){
			str = str + '<tr>';
				str = str + '<td>'+data[i]['chemical_name']+'</td>';
				//str = str + '<td>'+data[i]['chemical_multiplex']+'</td>';
				str = str + '<td>'+data[i]['GO_ID']+'</td>';
				//str = str + '<td>'+data[i]['GO_enrichment']+'</td>';
				str = str + '<td>'+data[i]['GO_description']+'</td>';
				str = str + '<td>'+data[i]['ratio_in_study']+'</td>';
				str = str + '<td>'+data[i]['ratio_in_pop']+'</td>';
				//str = str + '<td>'+data[i]['p_uncorrected']+'</td>';
				str = str + '<td>'+data[i]['p_bonferroni']+'</td>';
				//str = str + '<td>'+data[i]['p_holm']+'</td>';
				//str = str + '<td>'+data[i]['p_sidak']+'</td>';
				//str = str + '<td>'+data[i]['p_fdr']+'</td>';
				//str = str + '<td>'+data[i]['lane']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tableDiv).find("table > tbody").html(str);

	// Memorize the div for the table
	//chemicalGO_TableDiv = tableDiv;
}
function convert_chemicalGeneticstoTable(data, tableDiv, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in data){
		if( (multiplex == data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == data[i]['replicate']) ){
			str = str + '<tr>';
				//str = str + '<td>'+data[i]['AID']+'</td>';
				str = str + '<td>'+data[i]['chemical_name']+'</td>';
				//str = str + '<td>'+data[i]['chemical_multiplex']+'</td>';
				//str = str + '<td>'+data[i]['chemical_weight']+'</td>';
				//str = str + '<td>'+data[i]['GID']+'</td>';
				str = str + '<td>'+data[i]['gene_common_name']+'</td>';
				//str = str + '<td>'+data[i]['gene_barcode']+'</td>';
				//str = str + '<td>'+data[i]['gene_weight']+'</td>';
				str = str + '<td>'+data[i]['score']+'</td>';
				//str = str + '<td>'+data[i]['lane']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tableDiv).find("table > tbody").html(str);

	// Memorize the div for the table
	//chemicalGenetics_TableDiv = tableDiv;
}
function convert_parsonstoTable(data, tableDiv, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in data){
		if( (multiplex == data[i]['chemical1_multiplex'] || multiplex == data[i]['chemical2_multiplex'] || multiplex == "ALL") && (lane == data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == data[i]['replicate']) ){
			str = str + '<tr>';
				str = str + '<td>'+data[i]['chemical1_name']+'</td>';
				str = str + '<td>'+data[i]['chemical1_multiplex']+'</td>';
				str = str + '<td>'+data[i]['chemical2_name']+'</td>';
				str = str + '<td>'+data[i]['chemical2_multiplex']+'</td>';
				str = str + '<td>'+data[i]['correlation']+'</td>';
				str = str + '<td>'+data[i]['p_value']+'</td>';
				str = str + '<td>'+data[i]['lane']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tableDiv).find("table > tbody").html(str);

	// Memorize the div for the table
	//parsons_TableDiv = tableDiv;
}

function convert_chemicalComplextoTable(data, tableDiv, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in data){
		if( (multiplex == data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == data[i]['replicate']) ){
			str = str + '<tr>';
				str = str + '<td>'+data[i]['chemical_multiplex']+'</td>';
				str = str + '<td>'+data[i]['chemical_name']+'</td>';
				str = str + '<td>'+data[i]['complex_name']+'</td>';
				str = str + '<td>'+data[i]['lane']+'</td>';
				str = str + '<td>'+data[i]['z_score']+'</td>';
				str = str + '<td>'+data[i]['number_genes_with_data']+'</td>';
				str = str + '<td>'+data[i]['upload_date']+'</td>';
				str = str + '<td>'+data[i]['cid']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tableDiv).find("table > tbody").html(str);

	// Memorize the div for the table
	//chemicalComplex_TableDiv = tableDiv;
}

function convert_chemicalEnrichmenttoTable(data, tableDiv, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in data){
		if( (multiplex == data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == data[i]['replicate']) ){
			str = str + '<tr>';
				str = str + '<td>'+data[i]['chemical_multiplex']+'</td>';
				str = str + '<td>'+data[i]['chemical_name']+'</td>';
				str = str + '<td>'+data[i]['gene_name']+'</td>';
				str = str + '<td>'+data[i]['lane']+'</td>';
				str = str + '<td>'+data[i]['p_value']+'</td>';
				str = str + '<td>'+data[i]['upload_date']+'</td>';
				str = str + '<td>'+data[i]['sensitivity_type']+'</td>';
				str = str + '<td>'+data[i]['pid']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tableDiv).find("table > tbody").html(str);

	// Memorize the div for the table
	//chemicalEnrichment_TableDiv = tableDiv;
}

function convert_chemicalEnrichmentGOtoTable(data, tableDiv, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in data){
		if( (multiplex == data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == data[i]['replicate']) ){
			str = str + '<tr>';
				str = str + '<td>'+data[i]['GO_description']+'</td>';
				str = str + '<td>'+data[i]['GO_enrichment']+'</td>';
				str = str + '<td>'+data[i]['chemical_multiplex']+'</td>';
				str = str + '<td>'+data[i]['chemical_name']+'</td>';
				str = str + '<td>'+data[i]['enrichment_type']+'</td>';
				str = str + '<td>'+data[i]['id']+'</td>';
				str = str + '<td>'+data[i]['lane']+'</td>';
				str = str + '<td>'+data[i]['num_genes']+'</td>';
				str = str + '<td>'+data[i]['num_top_genes']+'</td>';
				str = str + '<td>'+data[i]['overlap_genes']+'</td>';
				str = str + '<td>'+data[i]['p_bonferroni']+'</td>';
				str = str + '<td>'+data[i]['p_fdr']+'</td>';
				str = str + '<td>'+data[i]['p_holm']+'</td>';
				str = str + '<td>'+data[i]['p_sidak']+'</td>';
				str = str + '<td>'+data[i]['p_uncorrected']+'</td>';
				str = str + '<td>'+data[i]['pid']+'</td>';
				str = str + '<td>'+data[i]['ratio_in_pop']+'</td>';
				str = str + '<td>'+data[i]['ratio_in_study']+'</td>';
				str = str + '<td>'+data[i]['sensitivity_type']+'</td>';
				str = str + '<td>'+data[i]['upload_date']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tableDiv).find("table > tbody").html(str);

	// Memorize the div for the table
	//chemicalEnrichmentGO_TableDiv = tableDiv;
}

function convert_chemicalEnrichmentMCtoTable(data, tableDiv, multiplex, lane, replicate){
	// Create table
	str = '';

	// Create Table
	for (var i in data){
		if( (multiplex == data[i]['chemical_multiplex'] || multiplex == "ALL") && (lane == data[i]['lane'] || lane == "ALL") && (replicate == "ALL" || replicate == data[i]['replicate']) ){
			str = str + '<tr>';
				str = str + '<td>'+data[i]['chemical_multiplex']+'</td>';
				str = str + '<td>'+data[i]['chemical_name']+'</td>';
				str = str + '<td>'+data[i]['enrichment_type']+'</td>';
				str = str + '<td>'+data[i]['id']+'</td>';
				str = str + '<td>'+data[i]['lane']+'</td>';
				str = str + '<td>'+data[i]['num_genes']+'</td>';
				str = str + '<td>'+data[i]['num_top_genes']+'</td>';
				str = str + '<td>'+data[i]['overlap_genes']+'</td>';
				str = str + '<td>'+data[i]['p_uncorrected']+'</td>';
				str = str + '<td>'+data[i]['pid']+'</td>';
				str = str + '<td>'+data[i]['sensitivity_type']+'</td>';
				str = str + '<td>'+data[i]['upload_date']+'</td>';
			str = str + '</tr>';
		}
	}

	// Throw down table
	$(tableDiv).find("table > tbody").html(str);

	// Memorize the div for the table
	//chemicalEnrichmentMC_TableDiv = tableDiv;
}

function findComplexInformation(data, tableDiv){
	chemicals = [];
	chemical_names_multiplexes = [];
	
	for (i in data){
		name_multiplex = data[i].chemical_name + ":" + data[i].chemical_multiplex + ":" + data[i].lane + ":" + data[i].replicate;
		if(chemical_names_multiplexes.indexOf(name_multiplex) == -1){
			chemical_names_multiplexes.push(name_multiplex);
			chemicals.push({name: data[i].chemical_name, multiplex: data[i].chemical_multiplex, lane: data[i].lane, replicate: data[i].replicate})
		}
	}
	str = "";

	
	// Manually add an all
	str = str + '<tr'
	if(chemicals == 0){str = str + " class='selected'";}
	str = str + '>';
		str = str + '<td name="chemicalName">ALL</td>';
		str = str + '<td name="chemicalMultiplex">ALL</td>';
		str = str + '<td name="lane">ALL</td>';
		str = str + '<td name="replicate">ALL</td>';
	str = str + '</tr>';

	for (var i in chemicals){
		str = str + '<tr'
		if(i == 0) {str = str + " class='selected'";}
		str = str + '>';
			str = str + '<td name="chemicalName">'+chemicals[i].name+'</td>';
			str = str + '<td name="chemicalMultiplex">'+chemicals[i].multiplex+'</td>';
			str = str + '<td name="lane">'+chemicals[i].lane+'</td>';
			str = str + '<td name="replicate">'+chemicals[i].replicate+'</td>';
		str = str + '</tr>';
	}

	
	// Throw down table
	$(tableDiv).find("table > tbody").html(str);
	setupInfoTableClick(tableDiv);

	return chemicals[0];
}

function setupInfoTableClick(tableDiv){
	$(tableDiv).find('#chemicalInfo_table tr').click(function() {
		var chemicalName = $(this).find("td[name='chemicalName']").html();
		var chemicalMultiplex = $(this).find("td[name='chemicalMultiplex']").html();
		var lane = $(this).find("td[name='lane']").html();
		var replicate = $(this).find("td[name='replicate']").html();
		
		$(this).addClass("selected").siblings().removeClass("selected");
		loadTableData(chemicalMultiplex, lane, replicate);
	});

}

// When the document is ready, load some custom sorting functions
$(document).ready( function(){
	// new sorting functions 
	jQuery.fn.dataTableExt.oSort['allnumeric-asc']  = function(a,b) {
		if(a == "nan"){ return -1; }
		if(b == "nan"){ return 1; }
		var x = parseFloat(a);
		var y = parseFloat(b);
		return ((x < y) ? -1 : ((x > y) ?  1 : 0));
	};
	 
	jQuery.fn.dataTableExt.oSort['allnumeric-desc']  = function(a,b) {
		if(a == "nan"){ return -1; }
		if(b == "nan"){ return 1; }
		var x = parseFloat(a);
		var y = parseFloat(b);
		return ((x < y) ? 1 : ((x > y) ?  -1 : 0));
	};
});

function initStandardDataTable(table, div, size, columns){
	var dataTable = $(table).dataTable({
		"sScrollY": size,
		"bPaginate": false,
		"bScrollCollapse": true,
		"bLengthChange": false,
		"bInfo": false,
		"aoColumnDefs": columns,
	});

	$(div).bind('resetColumnWidth', function () {dataTable.fnAdjustColumnSizing();});
	$(window).bind('resizeEnd', function () {dataTable.fnAdjustColumnSizing();});

	return dataTable;	
}

// This is a custom event resizeEnd for the window
$(window).resize(function() {
	if(this.resizeTO) clearTimeout(this.resizeTO);
	this.resizeTO = setTimeout(function() {
		$(this).trigger('resizeEnd');
	}, 100);
});

*/
