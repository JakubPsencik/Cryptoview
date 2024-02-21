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

# vyresit insufficient resources error u wss

# Do textu pridat:
- vic zkratek
- vic literatury - pouzit knizky - scopus.com, ieee explore, wed of science
- trosku rozbit ty kapitoly aby bylo videt co tam presne delam
- k tem vizualizacnim knihovnam pridat nejake obrazky s ukazkama
	- stahnout data BTCUSDT - 1d
	- pro vykresleni pouzit ty knihovny
	- vlozit do dokumentu
- k tem strategiim pridat nejake grafy a na nich ukazat jak ty to funguju
	- pro peaks and valleys vzit ty tydenni data
	- nejak do toho grafu dostat ty body, kde sou kopce a kde doliny
	- popsat ze to nakupuji/prodavaji pri 1% zmene
- dodelat popis widgetu

27/4/23
strana 17
------------------------------------------
predikce kakulovana v minutovych intervalech ktere muzou byt ovivnovane lokalnima extremama - reseni prejet na sekundove svicky nebo primo na trady, 60 krat sloyitejsi ... -[DONE]

eiminace paru ktere prodelavaji - pro ty nema smysl to pocitat
rozhodnovani jestli jit nejit, objem obchovani, mnoztsvi obchodu, neocekavane obhcody -[DONE]

1% - jednou za minutu close na close - peak a valley -[DONE]
stop loss - hranice

binance ma nejradsi konkretni hodnoty
trailingove obchody - binancu se to nelibi
--------------------------------------------

zajistene nezajistene obchodovani
nezajistene - stahuji z burzy kurz - a vte chvili posilaji na burze rozsahy
technicke problemy s burzou - tak sme v hajzlu

zajistine - posuvne okenko - je tam nejaka hranice - pri stoupani davaji nove prikazy

pridat
----------------------------------
highchart, fusion chart - zminit -[DONE]


pred zaverem udelat summary co to vsecko umi - ty featury

infografika generovana na infopanelu - ukazat jak se to viviji a priskakuje do grafu -[DONE]
nejaky live charticek -[DONE]
blokove schema - nejaky konfigurak - jake meny atd atd....

23.5 - termin obhajoby projektu

# DIPLOMKA #
- ---------------------------------------------------------------------------------------------------------------------------
# ###########
## GRAFIKA ##
# ###########

## 30.6.2023

# na co se podivat

# co naprogramovat
- definice standardu
- knihovny TradingView
- lightweight
- apex
- tradingView
- format dat: json, select

- zkusit definovat nejaky standart jak mi ti borci budou sypat ty data (prvni co me napada, tak je asi json)
- ja teda maximalne muzu zkusit se nejakym zpusobem napojit na tu charting TW library (at nedelam zase v tom LW)
- livedata pres websockety

do gitu pridat nastroj pro vizualizaci


UDELAT GIT REPO

- data budu brat ze stejne databaze
- udelat nejake komponenty do kterych se ty data budou stahovat bud pres API nebo si to tam borci hodi sami ( ja akorat definuju format )

- NACHYSTAT SI NEJAKY HARMONOGRAM!!!
- do tehdy a do tehdy tohle, do tehdy a do tehdy tohle
- paralelne se jede teoreticka cast aj vyvojova
- ja budu moct realne pracovat az dostanu od nich ty data

! odevzdavam praci 30.4
- co je v edisonu je dano, text prace ( teorii ) musim stihat do deadlline
- 14 dni po odevzdani muzu jeste neco dodelavat v implementaci
- textovou praci nenechavat na posledni chvili
- psat to hezky postupne
- prace rozsahove 50/50 - 50% teorie | 50% praxe
- oblackove inzenyrstvi - uml, aktivitni diagramy, stavove, atd, nejake classy (viz. tadeho DP)

- jaky mate prinos, studovali ste konkurenci, v cem je vase prace lepsi
- hele prostudoval sem toto, nastroje ktere to resi, atd atd...

- 25 stranek souvisleho textu staci
- odborny text
- 1. zadne odrazky
- 2. trpny rod, tematem prace bylo, prace se resila
- zadne mili ctenari, uvedomme si, atd...
- kazda kapitola musi byt s udovem
- maximalne do treti urovne 2.1 max
- vysrat se na popis html, http, atd...
- porovnani grafovych knihoven, treba v nejake tabulce a pak udelat nejake zhodnoceni
- burzu si vybrat treba jednu tu detailne popsat, a pak ty ostatni ve stylu pros cons

- co nejrychlej si udelat nejakou strukturu (teorie, praxe)
- kazdy bod ze zadani by mel byt viditelny v tej osnove !!!

- zaverecna prirucka na konci
- vytahnu nejakou cast a v odrazkach z toho udelam nejaky ebook
- nekopirovat cele pasaze z internetu

- co je do 10ti procent se toleruje (thesis check)

- zaklad projektu muzu pouzit do diplomky hehe :)

- schazet se prej bude chtet v sirsi skupince
- budu ho moset nahanet 24/7

SUMMARY
- do konce cervence teda udelat research



- literarni zdroje
    - vetsinou na internet zdroje - burzy, fora, ... , nejakou tistenou literaturu, vedecke clanky (scopus, eee explorer, wed of science)

DO CERVENCE UDELAT RESEARCH
 - co to ma delat
 - existujici nastroje
 - jak to ma byt resene
  - api na tahani dat atd, atd...
 - atd...


# jak bude ta appka koncipovana
- ve vysledku ja budu delat zase widgety ktere pak nejak nasazim do webu
-----------------------------------------------------------------------------------------------------------------
z pdfka do wordu spell checkerem
- praci psat az do posledni chvili ve wordu

-volume - objem kolik se v ramci toho candlu zobchodovalo

# 9.12.2023 - KONZULTACE PRED ZACATKEM SEMESTRU
- 60 90 120 investice -> zhodnoceni ktere ty obchody delat a nedelat
- proti euru obchodovat

- template - gridove obchodovani - aritmeticka nebo geometricka nebo logaritmicka stupnice
		- metoda kdy se nasoli objem penez a podle crossu nejakeho levelu je bud buy nebo sell
		- kdyz to vyleti z range tak cau, stop obchodovani
		- nejziskovejsi gridove strategie na binancu - podivat se na to

- moznost adaptivne posouvat ten grid - mrknout se na to 

- legisativa regulace pozadavky na mobilni zarizeni z hlediska vizualizace
- nejvic popsat - coinbase / binance - hlavni - jake typy obchodu existuji, co oni nabizi atd atd || light verze, pro verze
- technicka analyza - ja je nepopisu z hlediska funkcnosti - tyhle algoritmy = tyto typy grafu 
- ---------------------------------------------------------------------------------------------------------------------------

binance grid trading - spotovy grid - projit jednotlive - strucne popsat nad cim boti funguji jake vizualizacni prvky - zdroj pro tu moji praci.

napad - zkusim navrhnout vlastni automatizaci toho gridoveho obchodovani a na historickych datech to zkusim otestovat
			- a presne na mojem napadu bude stavena cela prace hehe, mindreader

- pro nejaky ten dany par zvolili nekterou z tech metod
- 1 minutove svice - spot kline
- vstup te moji mikro-appky jak daleko dozadu, kolik penez
- odsimulovat to na tech nasich datech
- rebalancing - nad najekym parem - bitcoin-bnb, 
- za nejaky ten usek se podivat jak na tom sem - vyhodnotil proste
- dca - simulace nad nasima datama
- db - tabulka na predpocet hodnot pro ty dane pary

takze - shrnuti 
- zaklad jsou ti trading boti
- jako prvni se zamerim na spot DCA a rebalancing bota a auto-invest
- zkusim podle nastavenych parametru vizualizovat simulaci toho bota
- soucasti (ne)bude pouziti cryptoview databaze kde zkusime pomoci nejakych stored procedur predvypocitat hodnoty ktere pak budu vizualizovat
- tim padem zadne data od kolegu potreba nebudou hehe



pozn. do databaze pravidelne stahuji jenom minutove svicky (spot kline 1m)

# 15.11.2023

denni tydenni mesicni horizont kde - nejlepe se to vyplati nakupovat


tydenni - den v tydnu a hodina (kazde pondeli tehdy a tehdy)

normujeme na euro - za jednotlive pary ukazat vyvoj - to prome znamena vsecko tedka v EUR

zprumerovani hodinove ceny tech candle
- 24 udaju (jako kdyby v kazde hodine udelat average price tech minutovych candles.. asi...)

normalne vytahnout hodinove svicky - porovnat za posledni tyden / za posledni mesic

jedeme max 120 dnu... (takze nastavime 1m, 1h, 1d, 1w, 1m, 2m, 3m, 4m)

pridat obchodovani pres indexy... (asi do teorie jeste)

usdt ve sporicim rezimu 
na flexu je to zamrazene (neco jako ze mam ten jednodeni savings staking a ze jestli kdyz to skonci tak se to pripise hnedka na ucet nebo co.. )
nejake sporeni
savings staking

QUESTIONS:

Jak přesně vizualizovat denní predikce? - Co když je nejvyšší průměř před nejnižším?
										- Vizualizovat v ten konkrétní den candly nákup a prodej?

Vizualizace týdenní predikce - Vizualizovat cenový průběh a opět místa kde nakoupit / prodat v ten daný týden?
							 - Nebo tam dát něco jako "během tohoto týdne bylo nejvhodnější nakoupit v tento den a tuto hodinu a prodat..."


ew-index -> evaluace probiha posledni patek v mesici

KONZULTACE - 13/12/2023 
do konce pristiho tydne poslat osnovu prace - 2 poloviny - teoreticka cast a prakticka cast - 
24.12 - DEADLINE pro tu osnovu

teoreticka - existujici reseni, algoritmy, knihovny, api atd, atd...
prakticka

melo by vypadnout nejake zhodnoceni - tabulka pros cons podle nejakych kriterii (to uz jsem chtel udelat davno hehe...)
a proste rekneme si toto naprogramujem toto to bude umet atd atd..
abych vedel ze vysledkem prace bude to a to

definovat si minimum

zadne zadani zamitnute nebylo
dulezite je aby ten oponent to mohl projit a rict ten bod byl splnen tady a tady...

vedouci resi spolupraci, oponent prakticky vysledek - zadani vs vystup
oponenti se nijak nedrbou s konfiguraci - spis nejake live demo

DEADLINE - pro psanou formu 30.4. !!! - textova podoba s datem odevzdanym v edisonu
reknu ze mam kontinualni vyvoj kdybych nestihal kodik

mesic pred odevzdanim mit hotovo a nechat to nejak pracovat pokud to bude nutne - ty algoritmy... (u te moji vizualizace)

casovy harmonogram udelat: co chcu ktery tyden udelat (co bude ktery tyden hotove) - plan by mel koncit 15.4.

lepsi je si dany text precist a vlastnima slovama to preformulovat.

simulace pojedu na tech historickych datech
musim zjistit co je hodl

casovy interval uz mam, max 120 dni

do toho 24.12.

osnova
casovy harmonogram
shrnuti co jsem ze ten semestr udelal, resp. co mu v tom lednu ukazu - za to mi pak bude davat zapocet.

prozkoumat ty jednotlive obdobi kdy to rostlo/padalo atd atd...
aplikovat ty trading boty nad tema danyma obdobima

bear / bull market

## TODO:
	- postahovat ikonky



bar chart - ve kterem bude vizualizovane kolik ten index v danem roce mel profit ( tabulka binance_index_rate - sloupec profit)
binance_index_asset_mapping - tabulka ktera ukazuje vuci ktere mene se ten dany coin obchoduje nejlip (EUR, USDT, BTC)

minuty 59
hodiny 59 x 24
dny 59 x 24 x 7
mesice - 59 x 24 x 7 x 28 dni v mesici

binance_index_asset_buy_last - idcko coinu spolecne s poslednim kurzem o konverzi na 1 euro

binance_index_asset_buy_minute - dim year - zesumarizovane data za dany rok; 9999 - 2022 -> present
binance_index_asset_buy_hour   -
binance_index_asset_buy_week   -
binance_index_asset_buy_month  -

binance_index_asset_recom - nejake doporuceni jak to kupovat

nejaka vizualizace ktera ukaze jestli se to vyplacelo/zvedalo konstantne nebo tam jenom nejaka jedna hodnota vystrelila



index name : 		idx_btc_eth 
year: 				2022 
invested: 			12 €
profit: 			18.4871 € (1.54059 %)


BTC 
	2022 -> amount: 0.000526954  | trades: 12 | close: 40264.5 € | profit: 21.1751 € (1.76459 %)
	2023 -> amount: 0.000491457  | trades: 12 | close: 40264.5 € | profit: 19.7487 € (1.64573 %)
	2024 -> amount: 0.0000263089 | trades: 1  | close: 40264.5 € | profit: 1.05719 € (1.05719 %)
	All  -> amount: 0.000993289  | trades: 24 | close: 40264.5 € | profit: 39.9143 € (1.6631  %)

ETH
	2022 -> amount: 0.0077757   | trades: 12 | close: 2036.52 € | profit: 15.8037 € (1.31698 %)
	2023 -> amount: 0.00759044  | trades: 12 | close: 2036.52 € | profit: 15.4272 € (1.2856 %)
	2024 -> amount: 0.000507375 | trades: 1  | close: 2036.52 € | profit: 1.03121 € (1.03121 %)
	All  -> amount: 0.0150298   | trades: 24 | close: 2036.52 € | profit: 30.5472 € (1.2728 %)



doporucene vysledky promitnout do toho roku 2024
naucim se v lednu a doporucim to v unoru/breznu

dat tam examply nejake, z tech simulaci tech botu (takze normalne zvolit nejaky interval a screen te aplikace)

uvod - zadne bylo nebylo atd...

abstrakt cca 10 radku
zaver - co sme splnili, co by slo zlepsit, atd..