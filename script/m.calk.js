/* ELENCO DEGLI ELEMENTI DELLA CALCOLATRICE 
	creazione delle variabili
*/
ww = window.innerWidth;						//rileva la larghezza della finestra
hw = window.innerHeight;					//rileva l'altezza della finestra
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
fine = "------------------------------";
/*	f i n e
*/
xw=(hw>300) ? "300" : hw;

function init() {
	document.getElementById("calcolatrice").style.width = xw+"px";
	document.getElementById("calcolatrice").style.marginLeft="-"+xw/2+"px";
	document.getElementById("intestazione").style.width = xw-40+"px";
	document.getElementById("menu").style.width = xw-10+"px";
	document.getElementById("nastro").style.width = xw-20+"px";
	document.getElementById("risultato").style.width = xw-10+"px";
	num.readOnly = true;
	num.style.width = xw-24+"px";
	document.forms["campo"].canc.style.display = "none";
	document.getElementById("tastierino").style.display = "table";
	document.getElementById("tastierino").style.marginLeft="-"+eval(xw/2-10)+"px";
	document.getElementById("tastierino").style.width = xw-20+"px";
	th=(xw-20)/5*4;
	document.getElementById("tastierino").style.height = th+"px";
	document.getElementById("menu4").style.color = "#ffffff";
	nastro.style.bottom = "17.1em";
	document.getElementById("calce").style.bottom=th+3+"px";
	document.getElementById("risultato").style.bottom=th+36+"px";
	document.getElementById("nastro").style.bottom=th+53+"px";
}

function migliaia(nx) {
}

function p_num(nx){
	num.value = nx;
	ris.focus();
}

function verifica_num(e,numero) {
}

function verifica_digit(digit) {
	// imposta le variabili per il calcolo
	var numero = num.value

	//cancella l'help se presente
	if (document.getElementById("testoHelp")) document.getElementById("testoHelp").remove();

	switch (tipocalc.value) {
		case "menu3":	//nel caso di digitazione di espressioni
			switch (digit) {
				case "=":
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
					scriviSuNastro(fine,"~");
					op.value="";
					break;
			}
			break;
		default:	//nel caso di digitazione dei menu di base "normale" e "scientifica"
			switch (digit) {
				case "+":
					if(vuo()) return false;
					scriviSuNastro(numero,"+");
					break;
				case "-":
					if (num.value.substr(num.value.length-1)=="-") return false;
					if(vuo()) {
						if(tipocalc.value=="menu2") return true;
						else return false;
					}
					scriviSuNastro(numero,"-");
					break;
				case "*":
					if(vuo()) return false;
					if(tipocalc.value=="menu2") {
						if(op.value=="") num.value=vos(numero);
						return true;
					}
					scriviSuNastro(numero,"*");
					break;
				case "/":
					if(vuo()) return false;
					if(tipocalc.value=="menu2") {
						if(op.value=="") num.value=vos(numero);
						return true;
					}
					scriviSuNastro(numero,"/");
					break;
				case "=":
					if(vuo()) return false;
					scriviSuNastro(numero,"=");
					scriviSuNastro("&nbsp;&nbsp;"+ris.value,"&nbsp;");
					scriviSuNastro(fine,"~");
					op.value="";
					break;
				case "i":
					if (tipocalc.value=="menu1") num.value *= -1;
					break;
			}
	}

	if (num.value=='0') return false;
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
	nastro.innerHTML += ('<DIV title="'+numero+'" '+ stileris + dbclick + '>'+numero+o+"</DIV>");
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
	nastro.innerHTML=fine+"<BR>";
	listato.value="";
	ris.value="";
	ac();
}

function ac(){ //azzera contatore
	if (conta.value=="[00]") num.value="";
	conta.value="[00]";
}

function aggiungi(n){
	var numcheck = /[^0-9.]/;

	v_p = num.value.substring(num.value.lastIndexOf("*")+1);	//verifica punto nell'ultima parte dopo *
	v_p = v_p.substring(v_p.lastIndexOf("/")+1);		//verifica punto nell'ultima parte dopo /
	if (tipocalc.value=="menu3") {
		v_p = v_p.substring(v_p.lastIndexOf("-")+1);		//verifica punto nell'ultima parte dopo -
		v_p = v_p.substring(v_p.lastIndexOf("+")+1);		//verifica punto nell'ultima parte dopo +
	}
	if (n==".") {
		if (v_p=="") { num.value+="0."; return true; }
		if (regexp.test(v_p) && v_p!="") return false;
	}

	switch (tipocalc.value) {
		case "menu2":
		numcheck = /[^0-9.*\/]/;
			break;
		case "menu3":
		numcheck = /[^0-9()+*-\/\^\%]/;
			break;
	}
	if (tipocalc.value=="menu3") numcheck = /[^0-9()+*-\/\^\%]/;
	if (!numcheck.test(n)) num.value=num.value+n;
	else verifica_digit(n);
}

function rm(){ //rimuove ultimo carattere
	num.value=num.value.substring(0,num.value.length - 1);
}

function menu(elemento){
	for(var i=1;i<4;i++){
		document.getElementById("menu"+i).style.backgroundColor="";
		document.getElementById("menu"+i).style.border="";
	}
	document.getElementById(elemento).style.backgroundColor="transparent";
	document.getElementById(elemento).style.border="1px solid transparent";
	document.getElementById("menu4").style.backgroundColor = "#006600";
	tipocalc.value=elemento;

	if (elemento=="menu3") {
		document.getElementById("tastierino").className = "espress";
	} else {
		document.getElementById("tastierino").className = "normal";
	};

	if (elemento=="menu4") {
		document.getElementById("menu4").style.backgroundColor = "#3399CC";
		document.getElementById("tastierino").style.display = "none";
		document.getElementById("calce").style.bottom="0px";
		document.getElementById("risultato").style.bottom="36px";
		document.getElementById("nastro").style.bottom="53px";
	} else init();

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

an();
init();
