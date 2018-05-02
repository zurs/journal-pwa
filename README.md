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
http-server -p 8080
```

## Backend

Backenden kan man köra med MAMP genom att göra symlinks från repositoriet till MAMP's htdocs, tex.

`/stack1/backend/` => `Application/MAMP/htdocs/stack1/`

`/stack2/backend/` => `Application/MAMP/htdocs/stack2/`

Composer är också nödvändigt då PHP-on-Couch används hittills och det installeras med Composer.

# Code-style
För att öka trovärdigheten så används code-stylen under.
## Backend

### Inkapsling
Måste ske på samma rad som klass eller funktions definitionen:
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
