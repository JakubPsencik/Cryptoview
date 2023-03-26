# konzultace poznamky
- server?
- realtimedata?
- websocket/api
- pine.js - matika, korelace - pouzivaji pro vypocty tech indokatoru
tradingview - pinejs function creating customs to this 
- rozdzchat tu knihovnu
- pro trading paru vyuzivame vypocet kopcu,dolin, etc
- kopce & doliny -> **Peaks and Valleys**
vzit a zdokumentovat tu knihovnu kde jak ji muzeme pouzit (frontend, backend) - python, mysql
ty knihovny odzkouset nad velkyma datama abysme meli nejake limity kolik tech dat to muze pri tech vypoctech vzit
dokteslovane krivky atd atd jakym zpusobem se to zpomali etc...
- obecne na Binancu se na
- 3 mesice zpatky 1d tyden mesic
- hledat korelace mezi pary
u paru me zajima kolik obchodu za jaky objem jestli to stoupalo klesalo
- melo by to rict chovani paru, nejpodobnejsi, nejodlisnejsi atd atd
-pr. vyhodnoti - kupuj eth vuci dolaru,...
- vybirame profitove mnoziny
-je potreba odfiltrovat duplicity
je potreba pokracovat v tech knihovnach, najit limity v performancu
mrknout na pine.js - bylo by super mit ekvival. knih. pro python, mysql,...
-knihovna na analyzu dat -- pandas - alternativa - dela obecne analyzy

- zkouset to prvni na 1-mesicnich datech treba (pine.js)


- zobrazovani nejakych bodu primo na te svicce - mel by byt schopny se zvyraznit - datum, value
- nekterou z os udelat logaritmickou
- zobrazeni krivek


-javascript libs --> templates pro backofficy, dashboardy, kolacove grafy
obecne aplikace v prohlizeci - nastaveni variant 
- grafy
- reporty
rolujici dashboard

rolujici dashboardy - roluje se to a neco se ukazuje a neco se deje
- kdyby se dal nastavil nejaky skript ktery bude porovnavat 2 grafy proti sobe, propadliky, championy
jedna nahledovka treba pul minuty - pak to zaroluje

- scenar zarolovany jsonem
- priznivejsi pro oko uzivatele

hele franto kdybys obchodoval tenhle par za tehhle podminek, tak...
pocet obchodu, pointy

svickovy graf s sloupcovym grafem a objemem obchodu

a nebo 2 grafy pod sebou


pposledni vec co delal hovadik - kdybysme


kdyz se to o procento zvedne oproti kopci
kdyz se to o procento klesne oproti doline

procento stoupaku vetsi nez 2%

schpnost od kopce do doliny vizualizovat

prolozeni zelenych a cervenych pruhu


- jelo by to na nejakem blackscreenu darkmode vypada lip

vector arty, piktografy, svgcka, 


1. objemy a pocty tradu
pasy pro stoupani a klesani - profit, neprofit
knihovny pro dashboardy, infografiku


METRONIC - komercni sablona
prezentace - bylo by dobre zkusit - slider revolution - same efekty (videodizajn skoro)

kdyztak by mi to dal slider revolution


## progress
- dynamicke prolozeni druhou krivkou
- darkmode design
- peaks & valleys comptutation

### questions
- peaks&valleys - jak to poznám, že to počítá dobře
				- jak poznám, kde mám dávat zelené a kde červené pásy, resp. jak určím ten border mezi profitem a loosem
- objemy a pocty tradu - existuje nejaky endpoint na binance api, ktery mi to vrati nebo to musim nejak spocitat sam
					- jak to vykreslovat do toho grafu

- knihovny pro dashboardy, infografiku - jeste nebyl udelan research

tabulka product

pary v trading ma smysl resit

spot_kline - minutove svice
pro casovy interval vykreslit graf

peak_valley head 
peak_valley node
peak_valley stats - compound interest , fixed deposit

bere kopce kdyz to zacne o procento stoupat tak to koupime

lukas moravec - framework na napojeni db a webu
lukas.moravec.st2@vsb.cz

db jede pres vpn ze

uz - cryptoview
heslo - cryptoview

nastaveni prav pro pohledy

dulezite v binance - pair for trade

cryptologos.cc

#TODO
- FastAPI 
- AioMysql


na utery nachystat:
- vykresleni nejakeho toho grafu
- vykresleni kupcu a dolin
- dat tam nejake ikonky pro ty pary uz (cryptologos.cc)
- a mrknout na nejakou tu infografiku/-



- coinmarketcup na ikonky
- jeden slide, jak se vyviji trhy - na tom coinmarketcupu to prej vsecko je


vzit last day podle ziskovosti

peak valley stats all where pairname not like %000%

last_day 1

previous day 1 2 3 5


z te tabulky vyselektovat ty nejprofitovejsi pary


3 grafy - day, week, month - v kazdem top x paru
	|------\
	|		\  /
	|------	 \/
	|		 /\__                           .... a tak dale proste, chapeme se
	|------	/	 \     /-----/\            / 
	|			  \   /        \          /
	|			   \_/          \        /
	|------						 \______/
	|
	|------
	|
	|------

- jakoby startovaci cara pro ty jdnotlive pary - a dal bude nasledovat graf jak se to vyvijelo za posledni dny (4 mam dojem rikal)


staci zobrazovat last_01 a prev_01 ... prev_03
pr. last_month_01,previous_month_01,previous_month_02,previous_month_03


udelat nejaky jeden veliky graf, kde zobrazit, ze ten dany par byl soucasne v day, week, month, (year?)

UDELAT NEJAKE HEJHORSI KOMBINACE - tzn. pokud ten par bude v week, month ale nebude v day - priznak ze to pada a neni uplne optimalni dal obchodvat

KLIDNE 3 SLOUPCOVE GRAFY VEDLE SEBR (day, week, month)

# 28.2.2023
-bavil se tady o nejakem nejvyhodnejsim tradovani
ape ze se obchoduje jenom jednou.. treba vuci btc
analyza toho co chceme nakupovat
tydenni predikce - dulezita pdm. musi tro byt v tech dennich (popr. tydennich)
view pair for trade , all ,compare

ty mesicni na ty dasboardy


tabulky saving stacking

stacking_all - binance nabizi.. (on tomu rika nejak) - simple earn
oni spoctou ty procenta a reknou si helee kdybyste to koupili pred tema 120 dnama tak kolik byste vydelali (vykryti ztrat, pripadne profit), neco jak dluhopisy

# poznamky k textove casti
# -----------------------------------

text bude rozdeleny na 2 casti:

1. state of the art
 - popis knihoven pouzivanych pri vizualizaci (tradingView, lightweightCharts, chartj.js, atd...)
 - nástroje po tvoření indikátorů (pandas, pineJS, ...)
 - porovnat data z TradingView s našima (např. použit RSI nebo nějaký jiný indikátor)
 - prostředí na dashboardy/inforgrafiku (METRONIC, slider revolution, bootstrap,...) - narvat do toho ty grafu, zkusit jestli pujde vzit muj kod a jenom to tam nakopirovat
 - rychlý vizuální monitoring (jestli existuje nějaký infotainment)
 - Dollar-cost averaging
 - peaks & valleys

2. popis praktické části
 - představení finálního řešení
 - představení featur, funkčnosti, ...


 american investing do meny
 jestli to mit po dnech, tydnech, hodinach
 simulace z nejakeho zakladniho kapitalu (budeme brat 1000 euro), jestli to invesstovat po castech nebo vcelku

 hodl koupim prodam
hodl se zajistenim
....
kdybyste nejakoupim tu opici koupili 


1 - do uvodu, coinbase - api, binance - api, kraken
2,3,4 - techlonologicke okno



## TODO:
# porovnani Binance dat s TradingView
	- Vzit data z Binance (mesic stare treba) - denni svice - [DONE]
	- na ty data aplikovat indikatory (treba RSI a moving average)
	- vysledky porovnat s grafama na TW - resp. podivat se a zhodnotit jestli se ty vypoctene vysledky zhoduji s datama v tech TW grafech
	- udelat screen toho TW grafu ze ktereho sem to porovnaval a zapsat

# Simulace Binance - Simple Earn
	- z tabulky saving_staking vybrat top 5 - 10 paru, ktere maji nejvyssi profit - [DONE] 
	- ty pary potom zobrazit do webove aplikace, spolecne s poctem dni kolik to bezi - [DONE]
	- k tomu nejaky lakavy a hezky popisek (kdybyste do toho pred xxx dny investovali, tak..)

# Top 20 paru - [DONE]
	- vytahnout z databaze jeste tydenni a mesicni data pro tech top 20 paru (denni data uz jsou vytazene) - [DONE]
	- ridit se podle tech dennich - [DONE]
	- porovnat to s mesicnima a tydennima - [DONE]
	- pokud nektery z tech paru v mesicnich a tydennich nebude, dostane krizek - [DONE]
	- zvetsit velikost nazvu jedn. paru (prip. se mrknout po nejakem cssku) - [DONE]

	- **update**
	- vytahnout nove day, week, month data z tech pohledu a orientovat se podle toho
	- pro vykresleni tech grafu vytahnout data z peak_valley_stats_all podle paru z pohledu


## 21.3 ##
- k OUR TOP pridat:
	- compound intered
	- fixed deposit
	- na boky muzou jit nejake widgety s vysvetlivkama jak ty investicni metody funguji

- ohledne deploye na obrazovky
	- vsecko tam bezi ve forme videa
	- zadny kod se nespousti, nic...

## TODO:
	- upravit query pro ziskavani view dat
	- jde to udelat jednim dotazem

	- popsat co znamena daily, weekly, monthly
	- IDEA ALERT! - rozdelit DFA na 4 podgrafy a ukazat tam 4 ruzne investice | budto podle men a nebo jednu menu podle intervalu