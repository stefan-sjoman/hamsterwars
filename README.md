# hamsterwars

Gjort G, VG och alla extrauppgifterna.

GET /defeated/:hamsterId
Hamstrar som förlorat flera gånger blir dubletter och förlorarens id returneras flera gånger.

GET /score/:challenger/:defender
Finns hamstarna i databasen men ingen match har ägt rum returneras 0 vinster för båda hamstrarna.

GET /fewMatches 
Jag valde att returnera en array med godtyckligt antal hamstrars id som spelat minst antal matcher.
Om det är 1 hamster som är på ensam sista plats returneras 1 hamsterId, 
om det är 20 hamstrar på sista plats på samma antal matcher returneras 20 hamsterId.

GET /manyMatches
Samma som fewMatches men med dom hamstrarna som spelat flest antal matcher.
