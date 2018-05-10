# journal-pwa
Hampus &amp; Elias

## Frontend

Installera `http-server` för att kunna köra applikationerna över http, annars fungerar inte service-workers
```
npm install -g http-server
```

Kör en skarp version av Angular-appen på port 8080, börja på `/stack1/frontend/journal-angular`
```
ng build --prod
cd dist
http-server -p 8080
```

Kör en skarp version av React-appen på port 8081, börja på `/stack2/frontend/journal-react`
```
npm run build
cd build
http-server -p 8081
```

För att bygga versionerna & starta http servern kör ifrån `/stack1/frontend/journal-angular` resp `/stack2/frontend/journal-react`:
```
npm run pwa
```
## Backend

Backenden kan man köra med MAMP genom att göra symlinks från repositoriet till MAMP's htdocs, tex.

`/stack1/backend/` => `Application/MAMP/htdocs/stack1/`

`/stack2/backend/` => `Application/MAMP/htdocs/stack2/`

Composer är också nödvändigt då PHP-on-Couch används hittills och det installeras med Composer.

# Code-style
För att öka trovärdigheten så används code-stylen under.

## Backend

### Grundläggande
* Inga requires eller inladdning av klasser sker utan allting laddas på ett ställe automatiskt.
* Använd alltid use för namespaces, referea inte till något direkt
* alla klasser som ärver från något måste implementera sin konstructor med parent anrop
* Json parsning & auth sker på samma sätt till servern

### Inkapsling
Måste ske på samma rad som klass- eller funktionsdefinitionen:
```php
class AClass {
  public function aFunction() {
  }
}

```
### Logiska satser 
if-satser måste vara på följande form:
```php
if($logical_comparison) {
  // If true
}
```
if-else-satser måste vara på följande form:
```php
if($logical_comparison) {
  // If true
} else {
  // If false
}
```
**Förutom** ifall `return` används i första satsen **eller** den logiska statsen avbryter exeveringen t.ex via `exit()`.
Då ska det se ut så här:
```php
if($logical_comparison) {
  // If true
  return $a_value;
}
return $another_value;
```
alternativt:
```php
if($logical_comparison) {
  // If true
  somethingThatResultsInReturnOrExit();
}
somethingThatResultsInReturnOrExit();
```

## Frontend
arrow-funktioner måste börja på en ny rad på följande sätt:
```
waitingForStuff(stuff => {
  stuff.someFunc();
})
```
Funktionskedjor skapas på ny rad
```
waitingForStuff()
.then(result => {
  result.handle();
});
```

Det ska vara line-break för måsvingar, line-break efter den första och line-break innan den sista måsvingen. Alltså:
```
let variable = {[line-break]
  property: 'value' [line-break]
}
```
