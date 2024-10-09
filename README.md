# Calk:Magin
Calk:Magin, una calcolatrice a nastro sviluppata in HTML e Javascript da richiamare da una pagina Web.
## Help
La calcolatrice Calk:Magin opera in quattro modalità differenti.

- La modalità **Normale**, mette in colonna tutte le operazioni digitate;
- La modalità **Scientifica**, raggruppa le moltiplicazioni e divisioni in un unico rigo per dare priorità a questo tipo di operazioni;
- La modalità **Espress**, prevede l'esecuzione di calcoli complessi su un unico rigo, utilizzando anche le parentesi tonde "**()**", l'elevamento a potenza "*^*", il resto "**%**" tra due numeri;
- La modalità **Listato**, prevede anche l'inserimento di note di testo, allineate a sx, esplicative dell'operazione sul rigo.
Le varie modalità possono essere richiamate da menu o semplicemente digitando l'iniziale.

Tasti speciali:
- **I** - nel menu Normale, inverte il segno dell'operando;
- **N, S, E, L** - richiamano i rispettivi menu;
- **H** - richiama la presente guida.

È presente una avanzata funzione per il salvataggio di tutto il listato digitato, premendo con il tasto destro in un qualsiasi punto del nastro.
## Installazione
Copia i file del repository nella directory del tuo sito internet dove vuoi che venga visualizzata la calcolatrice.

**Nota:** per una migliore visualizzazione della calcolatrice, sarebbe opportuno richiamarla dalla tua pagina web inserendo un tag `<a>` nella pagina.
```html
<a href="#" onclick="window.open('https://www.example.com/calkmagin/calk.html','','width=210,height=600,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no')" title="Calcolatrice a nastro"><img alt="Calcolatrice a nastro" src="https://www.example.com/icon-calk.png"></a>


```
> **Tips:**  
> È possibile anche creare un tag `<a>` da inserire nella pagina web che permette di creare un `Bookmarklet` da trascinare nei preferiti del proprio browser, per utilizzare la calcolatrice senza andare sul sito.
```html
<a href="javascript:(function(){window.open('http://www.example.com/calkmagin/calk.html','','width=210,height=500,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no');})();" style="background-color: #00bf30; border-radius: 10px; font-size: 16px; padding: 4px 10px;" title="clicca e trascina nella barra dei segnalibri">Bookmarklet CalK *</a>
```

