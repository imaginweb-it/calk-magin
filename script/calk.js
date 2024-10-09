/* ELENCO DEGLI ELEMENTI DELLA CALCOLATRICE 
	creazione delle variabili
*/
window.onload = function() {
	document.onselectstart = function() {return false;} // ie
	document.onmousedown = function() {return false;} // mozilla
	document.oncontextmenu = function() {return false;}
	document.ondragstart = function() {return false;}
}

var num = document.forms["campo"].numero;			//campo dove digiti
var list = document.getElementById("listato");			//casella del listato
var ris = document.forms["calcolatrice"].risultato;		//campo risultato
var op = document.forms["calcolatrice"].operatore;		//compo nascosto per l'operatore
var tipocalc = document.forms["calcolatrice"].tipocalc;		//campo nascosto per il tipo di calcolatrice
var precedente = document.forms["calcolatrice"].precedente;	//campo nascosto che riporta il dato precedente
var conta = document.forms["calcolatrice"].conta;		//campo del contatore
var nastro = document.getElementById("nastro");			//div per il nastro 
var regexp = /\./;						// regular expression per verificare il punto
var scient = /[*\/]/;						// regular expression per verificare inserimento moltiplicazione o divisione
var nota = "";							//variabile per la scrittura della nota
var format = "                              ";			//variabile per la larghezza di 30 caratteri per la formattazione textarea nota
/*	f i n e
*/

function migliaia(nx) {
	if (!scient.test(nx)){ //evita il calcolo migliaia nella moltiplicazione e divisione scientifica
		nx = nx.replace(/'|&nbsp;/g,"");
		var s = nx.indexOf(".");
		if(s==-1){s=nx.length}
		for(var i=s-3;i>0;i-=3){nx=nx.substr(0,i)+"'"+nx.substr(i,nx.length)}
		if (nx.substr(0,2)=="-'") nx=nx.replace(/'/,"");
	}
	return nx;
}

function p_num(nx){//pulisce il numero dall'identificatore migliaia
	num.value = nx.replace(/'|&nbsp;/g,"");
	ris.focus();
}

function verifica_num(e,numero) {
	// imposta le variabili per il calcolo
	var keynum;
	var keychar;
	var numcheck;

	if(window.event) { // IE
		keynum = e.keyCode;
	} else if(e.which) { // Netscape/Firefox/Opera
		keynum = e.which;
	}

	keychar = String.fromCharCode(keynum);
	//numcheck = /\D/; è uguale a /[^0-9]/
	numcheck = /[^0-9]/;

	//cancella l'help se presente
	if (document.getElementById("testoHelp")) document.getElementById("testoHelp").remove();

	//alert(keynum)
	// control keys

	switch (tipocalc.value) {
		case "menu3":	//nel caso di digitazione di espressioni
			numcheck = /[^0-9()+*-\/\^\%]/;
			switch (keynum) {
				case 13: ; case 61:
					/* funzione per verifica dell'errore nel campo digitato
					 */
					if (tipocalc.value=="menu3") {
						try {
							var r = eval(numero); //risultato arrotondato al massimo a 5 cifre
						} catch(e) {     
							alert("Errore nella formula. Verificare i dati immessi")    // Gestione dell'eccezione
							return false;
						}
					}
					/* fine verifica
					 */

					scriviSuNastro(numero,"=");
					scriviSuNastro("&nbsp;&nbsp;"+ris.value,"&nbsp;");
					scriviSuNastro("--------------------","~");
					op.value="";
					break;
				case 110: ; case 78:
					menu("menu1");
					break;
				case 115: ; case 83:
					menu("menu2");
					break;
				case 101: ; case 69:
					menu("menu3");
					break;
				case 108: ; case 76:
					menu("menu4");
					break;
				case 104: ; case 72:
					helpp();
					break;
			}
			break;
		case "menu4":	//nel caso di digitazione di un listato
			switch (keynum) {
				case 43:
					scriviSuNastro(numero,"+");
					break;
				case 45:
					scriviSuNastro(numero,"-");
					break;
				case 42:
					scriviSuNastro(numero,"*");
					break;
				case 47:
					scriviSuNastro(numero,"/");
					break;
				case 13: ; case 61:
					if (isNaN(num.value)) {
						nota += numero;
						scriviSuNastroNota(numero);
					} else {
						scriviSuNastro(numero,"=");
						scriviSuNastro("&nbsp;&nbsp;"+ris.value,"&nbsp;");
						scriviSuNastro("--------------------","~");
						op.value="";
					}
					break;
				default:
					return true;
			}
			break;
		default:	//nel caso di digitazione dei menu di base "normale" e "scientifica"
			switch (keynum) {
				case 43:
					if(vuo()) return false;
					scriviSuNastro(numero,"+");
					break;
				case 45:
					if (num.value.substr(num.value.length-1)=="-") return false;
					if(vuo()) {
						if(tipocalc.value=="menu2") return true;
						else return false;
					}
					scriviSuNastro(numero,"-");
					break;
				case 42:
					if(vuo()) return false;
					if(tipocalc.value=="menu2") {
						if(op.value=="") num.value=vos(numero);
						return true;
					}
					scriviSuNastro(numero,"*");
					break;
				case 47:
					if(vuo()) return false;
					if(tipocalc.value=="menu2") {
						if(op.value=="") num.value=vos(numero);
						return true;
					}
					scriviSuNastro(numero,"/");
					break;
				case 13: ; case 61:
					if(vuo()) return false;
					scriviSuNastro(numero,"=");
					scriviSuNastro("&nbsp;&nbsp;"+ris.value,"&nbsp;");
					scriviSuNastro("--------------------","~");
					op.value="";
					break;
				case 105: ; case 73:
					if (tipocalc.value=="menu1") num.value *= -1;
					break;
				case 110: ; case 78:
					menu("menu1");
					break;
				case 115: ; case 83:
					menu("menu2");
					break;
				case 101: ; case 69:
					menu("menu3");
					break;
				case 108: ; case 76:
					menu("menu4");
					break;
				case 104: ; case 72:
					helpp();
					break;
			}
	}

	if ((keynum==null) || (keynum==0) || (keynum==8)
	|| (keynum==9) || (keynum==27))
		return true;
		v_p = numero.substring(numero.lastIndexOf("*")+1);	//verifica punto nell'ultima parte dopo *
		v_p = v_p.substring(v_p.lastIndexOf("/")+1);		//verifica punto nell'ultima parte dopo /
	if (keynum==46) {
		if (numero=="") { num.value="0"; return true; }
		if (!regexp.test(v_p) && v_p!="") return true;
	}
	if (num.value=='0') return false;
	return !numcheck.test(keychar);
}

function scriviSuNastro(numero,o){ //numero ed operatore
	//popolazione della textarea della nota
	if (o=="&nbsp;") list.value += "         ______________________\r\n\b";
	list.value += (format.substr(nota.length+(numero.replace(/&nbsp;/g, " ")+o.replace(/&nbsp;/g, " ")).length)+
	numero.replace(/&nbsp;/g, " ")+o.replace(/&nbsp;/g, " ")+"\r\n\b");
	nota = "";
	numero=vos(numero);
	if (numero.substr(numero.length-1)==".") numero += "0";
	num.value = ""; //azzera il campo
	stileris = (o=="&nbsp;") ? 'class="stileris" ' : ""; //imposta uno stile al risultato
	dbclick = (o=="~") ? 'onclick="ris.focus();return false;"' : 'ondblclick="p_num(this.title)"'; //imposta l'evento per il doppio click
	nastro.innerHTML += ('<DIV title="'+migliaia(numero)+'" '+ stileris + dbclick + '>'+numero+o+"</DIV>");
	nastro.scrollTop=10e5;
	if(o!="&nbsp;" && o!="~") calcola(numero,o);
}

function scriviSuNastroNota(nota){ //nota
	nastro.innerHTML += ('<DIV class="stilenota">'+nota+"</DIV>");
	list.value += nota;
	num.value = ""; //azzera il campo
	nastro.scrollTop=10e5;
}

function calcola(numero,o){ //numero ed operatore
	potenza = numero.indexOf("^");
	if (potenza!=-1) numero="Math.pow("+numero.substr(0,potenza)+","+numero.substr(potenza+1,numero.length)+")";

	progressivo=eval(conta.value.replace(/\D/g,""))+1;
	conta.value ="[" + ((progressivo<10) ? "0" : "") + progressivo + "]"; //scrive il numero progressivo delle operazioni
	precedente.value=numero; //memorizza il precedente numero
	var r = eval(eval(ris.value+op.value+numero).toFixed(5)); //risultato arrotondato al massimo a 5 cifre
	op.value = o;
	ris.value = (r==undefined) ? 0 : r;
	ris.title = migliaia(r.toString());
}

function arrotonda(nx) {
	nx=parseFloat(parseInt((nx)*10e5+0.5)/10e5);
	return nx;
}

function vos(numero){ //verifica operatore solo, se non è presente il numero
	precedentevalore=precedente.value;
	if (op.value=="" && numero!="") { //verifica che sia iniziato un nuovo calcolo
		ac();
		ris.value="";
	}
	if(numero=="") {
		if (op.value=="") {
			ac();
			if (ris.value=="") {
			       	return "0";
			}
			else {
				numero=ris.value;
				ris.value="";
				return numero;
			}
		}
	       	else {
			return precedentevalore;
		}
	}
	return numero;
}

function vuo(){ //verifica ultimo operatore 
	if(num.value.substr(num.value.length-1)=="*" || num.value.substr(num.value.length-1)=="/") return true;
	if(num.value.substr(num.value.length-1)=="-") return true;
	//if(tipocalc.value=="menu2" && (num.value.substr(num.value.length-1)=="*" || num.value.substr(num.value.length-1)=="/")) return true;
}

function an(){ //azzera nastro
	nastro.innerHTML="---------------------<BR>";
	listato.value="";
	ris.value="";
	ac();
}

function ac(){ //azzera contatore
	if (conta.value=="[00]") num.value="";
	conta.value="[00]";
}

function menu(elemento){
	for(var i=1;i<=4;i++){
		document.getElementById("menu"+i).style.backgroundColor="";
		document.getElementById("menu"+i).style.border="";
	}
	document.getElementById(elemento).style.backgroundColor="transparent";
	document.getElementById(elemento).style.border="1px solid transparent";
	tipocalc.value=elemento;
}

var testoHelp = ("<DIV id='testoHelp'><br>La calcolatrice CalkMagin opera in quattro modalit&agrave; differenti.<br /><br>"+
	"- La modalit&agrave; <strong>Normale</strong>, mette in colonna tutte le operazioni digitate;<br>"+
	"- La modalit&agrave; <strong>Scientifica</strong>, raggruppa le moltiplicazioni e divisioni in un unico rigo per dare priorit&agrave; a questo tipo di operazioni;<br>"+
	"- La modalit&agrave; <strong>Espress</strong>, prevede l'esecuzione di calcoli complessi su un unico rigo, utilizzando anche le parentesi tonde &quot;<strong>()</strong>&quot;, l'elevamento a potenza &quot;<strong>^</strong>&quot;, il resto &quot;<strong>%</strong>&quot; tra due numeri;<br>"+
	"- La modalit&agrave; <strong>Listato</strong>, prevede anche l'inserimento di note di testo, allineate a sx, esplicative dell'operazione sul rigo.<br><br>"+
	"Le varie modalit&agrave; possono essere richiamate da menu o semplicemente digitando l'iniziale.<br><br>"+
	"Tasti speciali:<br><strong>I</strong> - nel menu Normale, inverte il segno dell'operando;<br>"+
	"<strong>N, S, E, L</strong> - richiamano i rispettivi menu;<br>"+
	"<strong>H</strong> - richiama la presente guida.<br>"+
	"&Egrave; presente una avanzata funzione per il salvataggio di tutto il listato digitato, premendo con il tasto destro in un qualsiasi punto del nastro.<br></DIV>");

function helpp() {
	if (!document.getElementById("testoHelp")) nastro.innerHTML += testoHelp;
	nastro.scrollTop=10e5;
}

/**
 * funzione HTML5 per il salvataggio del listato in un file di testo
 */

function saveTextAsFile() {
	var textToWrite = document.getElementById("listato").value;
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	var fileNameToSaveAs = "listato.txt";

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "My Hidden Link";

	window.URL = window.URL || window.webkitURL;

	downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
	downloadLink.onclick = destroyClickedElement;
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);

	downloadLink.click();
}

function destroyClickedElement(event) {
	document.body.removeChild(event.target);
}

// EOF

