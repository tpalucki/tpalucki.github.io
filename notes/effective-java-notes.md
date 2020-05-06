# Effective Java 3rd edition
FIle contains notes from Effective java book

# Chapter 1: Introduction
Nothing special.

# Chapter 2: Creating and destroying objects
 

## Item 1: Consider static factory methods instead of constructors
Bardziej można sie dostasować udostępniając takie metody zamiast konstruktorów


## Item 2: Consider a builder when faced with many constructor parameters
Nothing yet.


## Item 3: Enforce the singleton property with a private constructor or an enum type
Klasa ma domyślny konstruktor, chyba że dodamy prywatny konstruktor - wtedy nie możemy rozszerzyć klasy - bo nie da sie wywołać super() w konstruktorze.
Możemy za to zrobić getInstance() i zwracać singleton.


## Item 4: Enforce noninstantiability with a private constructor
Nothing yet


## Item 5: Prefer dependency injection to hardwiring resources
Nothing yet

## Item 6: Avoid creating unnecessary objects
Np Pattern, zamiast tworzyć za każdym razem instancje i kompilować pattern, lepiej skompilować raz w trakcie inicjalizacji i używać tego skompilowanego.


## Item 7: Eliminate obsolete object references
Nothing yet

## Item 8: Avoid finalizers and cleaners
Java 9 usunela finalizery i zastapily je `cleaners` -- sprawdzic te 2 pojecia  
Zamiast tego uzywac try-with-resources i recznie czyscic obiekt/ nullowac referencje  


## Item 9: Prefer try -with-resources to try - finally
Uzywac try-with-resources zamiast try-finally  
Zeby uzyc resource jak InputStream czy Connection w try-with-resources (since Java 7), klasa musi implementowac interfejs `java.lang.AutoCloseable`
 
 `try-with-resources` sa lepsze bo:
 
- ladniej, krocej wygaldaja - oszczedzamy czas i latwiej sie czyta
- lepsza diagnoza bo rzuca poprawnie wyjatki - w przypadku gdyby w ciele try polecial wyjatek i potem w finally przy close to ten drugi przykryje ten pierwszy


# Chapter 3 - Methods common to all objects
Metody wspolne dla wszyskich obiektow, czyli w klasie `Object`:

```java
toString()  
hashCode()  
equals()
clone()
finalize()
```
Nadpisujac je przy rozszerzaniu klas powinnismy trzymac sie ich **kontraktu**!


## Item 10 - Obey the general contract when overriding equals
Operator rownosci  `==` w java porownoje wartosci elementow: dla typow prymitiwynych bedzie to wartosć czyli 1 = 1 da true, dla obiektow bedzie to pownanie wartosci referencji (bo w java zmienna typu nie prymitywnego przechowuje wortosć referencji czyli adres w pamieci w której znadjuje sie obiekt), dla przkladu w jshell:

```java
	String a = new String("A");  
	String b = new String("B");  
	String c = "A";
	String d = "A";    
	
	> a == a
	true  
	> a == b  
	false  
	> a == c
	false  
	> c == d
	true
	> c == "A"
	true
``` 

Gdy nadpisujemy `equals` musimy trzymac sie kontraktu (bo metoda equals implementuje relacje równości - equivalence relation), ktory ma takie własnośći:

- **Reflexive**: For any non-null reference value x , `x.equals(x)` must return `true`.
- **Symmetric**: For any non-null reference values x and y , `x.equals(y)` must return `true` if and only if `y.equals(x)` returns `true`.
- **Transitive**: For any non-null reference values x , y , z , if `x.equals(y)` returns `true` and `y.equals(z)` returns `true` , then `x.equals(z)` must return `true` .
- **Consistent**: For any non-null reference values x and y , multiple invocations of `x.equals(y)` must consistently return `true` or consistently return `false`, provided no information used in equals comparisons is modified.
- For any non-null reference value x , x.equals(null) must return false .

Jak nadpisywac `equals` w dobry sposob:

- Użyj `==` zeby spradzic czy argument jest referencja do tego obiektu
- Użyj `instanceof` do sprawdzenia czy argument ma poprawny typ
- Zrzutuj argument na poprawny typ
- Dla każdego znaczącego pola w obiekcie sprawdź czy to pole jest takie samo jak odpowiadające mu pole w obecnym obiekcie
- Jeśli wszystkie testy przeszły zwróć `true`, w przeciwnym wypdaku zwróć `false`.

Gdy jakieś pole możę być null-em, neleży zabezpieczyć się przed `NullPointerException`. W tym celu możemy porownać statyczną metodą `Objects.equals(o1, o2)` zamiast wywoływać metodę na instancji klasy.

Jeśli nadpisujemy `equals` to zawsze nadpisuj rownież `hashCode` (wiecej w Item 11)  
Nie zmieniaj typu argumentu, np.: `equals(MyType)` --> `equals(Object)`

**Przeciążenie** metody - piszemy taka sama metode tylko z innymi argumentami  
**Nadpisanie** robimy metode o takim samym identyfikatorze  

Dla zasady lepiej nie nadpisywać `equals` chyba ze mamy dobry powod ku temu, jak na przykład zmiana logiki porównywania itp


## Item 11: Always override hashCode when you override equals
You must override hashCode in every class that overrides equals. Nie nadpisujac naruszamy kontrakt dla hashCode i tym samym popsujemy dzialanie kolekcji takich jak HashMap czy HashSet.  

Equal objects must have same hash Codes
Jeśli nie są equal to mogę mieć różne kody ale nie muszę. Jeśli zapewnisz ze będą miały różne to przyspieszydzialanie kolekcji opartych na hashowaniu

czyli np taka implementacje jest legalna (bo 2 rowne obiekty beda mialy ten sam hashCode), ale jest tragicznie pomyslana bo WSZYSTKIE obiekty beda mialy ten sam hash code:

```java
// The worst possible legal hashCode implementation - never use!
@Override public int hashCode() { return 42; }
```

**PRO TIP** W IntelliJ IDEA możeszy wybrać z menu `Code -> Generate.. -> Equal and HashCode` - i tam możemy wybrać z jakiego szablonu (frameworka typu: Lombok, Guava Hashing czy AutoValue) mają zostać wygenerowane te metody. Można też pooznaczać adnotacjami dostarczonymi przez jedną z tych bibliotek i nam się samo wygeneruje.


## Item 12: Always override toString
Domyślna implementacja jest taka że toString zwaraca Nazwe_klasy@hashCode, np: `PhoneNumber@163b91`. 

Niezależnie czy nadpisujesz toString czy nie, zawsze umożliwij użytkownikowli klasy dostanie sie do informacji wewnatrz klasy (przez gettery itp), bo inaczej **zmuszasz** go do parsowania tego co zwraca toString.

Dobrą praktyką jest nadpisywać.


## Item 13: Override clone judiciously
Klasy ktore wspieraja klonowanie oznacza sie interfejsem `java.lang.Cloneable`. Nie ma metod - jest po to żeby oznaczyć że klasa może być sklonowana. Jeżeli klasa jest oznaczona jako Cloneable to mozna użyć metody clone z klasy `java.lang.Object`, która zwaraca kopię pole po polu danego obiektu - jeżeli nie jest oznaczona jako Cloneable to zostanie rzucony wyjątek `java.lang.CloneNotSupportedException`.

Wszystko klasy rozszerzające muszę przestrzegać tego kontraktu - bo nie da sie wycofac z już implementowanego interfejsu. Jest to bardzo **delikatne, cieżki do utrzymania i nie można tego wymusić** na klasach rozszerzających. Dodatkowo jest tworzony nowy obiekt bez wołania jego konstruktora.  
Specyfikacja nei mowi dokładnie co to znaczy __kopia obiektu__, dobrze natomaist jeśli będą spełnione takie założenia:

`x.clone() != x` => `true`  
`c.clone().equals(x)` => `true`  
`x.clone().getClass() == x.getClass()` => `true`  

konwencja mówi, że obiekt zwracany przez `clone()` powiniem być uzyskany przez wywołanie `super.clone()`. Tak też uzyskujemy ten klon obiektu - poprzez wywpołąnie metody clone z super-klasy.

Klasy **Immutable** nie powinny implementować interfejsu __Cloneable__ bo po co - będzie to tylko marnowanie zasobów bo i tak nie można zmienić stanu obiektu, wieć sklonowany będzie zawsze identyczny jak ten orginał. Równie dobrze można używać refejrencji do oryginalnego obiektu.
Implementacja `clone()` może wyglądać tak jak poniżej: 

```java
@Override
protected Object clone() throws CloneNotSupportedException {
    return super.clone();
}
```

Możemy też zamiast zwracać Object zwrócić bezpośrednio Complex, ze względu na to że Java wspiera Covariant Return Types - jeśli metoda ktorą nadpisujesz zwraca Object - to metoda nadpisująca może zwrócić typ który rozszerza Object, w tym przypadku Complex. Dzieki temu klient korzystający z naszej klasy unika rzutowania na docelowy typ.

```java
@Override
protected Complex clone() {
        try {
            return (Complex) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(); // Can't happen so we push an Error
        }
 }
 ```

**Musimy upewnic sie że po sklonowaniu zmiana nowego klona nie wpływa w żaden sposób na oryginalny obiekt** - np mamy klasę która ma tablicę referencji (np Liste). Robiąć super.clone, dostaniemy w nowym obiekcie kopię talibcy z tymi samymi referencjami, a więc modyfikacja klona zmodyfikuje oryginalny obiekt!  
Najłątwiej upewnic sie wołając klone na każdym elemencie takiej tablicy.  

Jako aletrnatywe do implementacji interfejsu Cloneable możemy zastosować tzn **copy constructor** (aka conversion constructor) lub **copy factory** (aka conversion factory). Czyli konstruktor, który przyjmuje obiekt i go kopiuje lub metodę która przyjmuje obiekt jako argument  i zwraca nową instancję. 


## Item 14: Consider implementing `java.lang.Comparable`
Poprzez implementowanie `Comparable` klasy wskazują że ich instancje mają __natural ordering__.

`java.lang.Comparable` zawiera jedną metodę `int compareTo(T arg)`. Zwraca ujemną liczbę jeśli obiekt z argument jest mniejszy, zero jeśli jest równy lub większą liczbę od zera jeśli argument jest większy.  
Może rzucić `java.lang.ClassCastException` jeśli danego typu nie da się porównać do porównywanego typu.  
Klasy które polegają na kontrakcie tego Comparable to te które korzystają z naural ordering jak:

- TreeSet
- TreeMap
- utlilities from Collections and Arrays

Relacja ma spełniać podobne restrykcje jak kontrakt dla equals:

- reflexivity
- symmetry
- transitivity

W Java 8 do tego interfejsu dołożono statyczne metody do konstruowania comparatorów.  Robi się to używając Interfejsu `java.utli.Comparator<T>`.  Przykładowa implementacja 

```java
private static final Comparator<Complex> COMPARATOR = 
	Comparator.comparing((Complex complex) -> complex.re)
            .thenComparing((complex -> complex.im));

@Override
public int compareTo(Complex complex) {
    return COMPARATOR.compare(this, complex);
}
```
Możemy tu stworzyć porządek leksykograficzny poprzez wywołanie kolenych metod thenComparing, thenComparingInt itp dowolnie od tego w jakiej kolejnosci chcemy porównywać pola klasy.

### Mierzenie czasu wykonania metody
Przed Java 8 robiliśmy:

```java
long start = System.currentTimeMillis();
Thread.sleep(5000);
long end = System.currentTimeMillis();

long diff = end - start;
```
od Java 8 możemy użyć nowego Date API. Używamy `java.time.Instant` - punkt w czasie oraz `java.time.Duration` - do liczenia różnicy w czasie:

```java
Instant start = Instant.now();
Thread.sleep(5000);

Instant end = Instant.now();
System.out.println("Time spent on execution: " + Duration.between(start, end).toMillis());
```

W Apache Commons, Guavie oraz Springu mamay Obiekty StopWatch które działają jak Instant w Java 8+


# Chapter 4: Classes and Interfaces
.


## Item 15: Minimize the accessibility of classes and members
Podstawowa różnica pomiedzy dobrze zaprojektowanymi, a źle jest to czy ukruwają przed klientem implementacje. Klasa powinna oddzielić udostepnic jej interfejs i schować implementację. Nazywamy to **ukrywaniem informacji** lub **enkapsulacją**.

Zasada jest taka, trzymamy zawsze minimalną widoczoność i dostęp do zminnych, pól i metod klasy

Klasy mogą mieć dostęp: 

- public - widoczne dla wszystkich
- package-private - w obrębie pakietu (bez modyfikatora)

Dostęp dle members (fields, methods, nested classes, and nested interfaces), od najmniejszego:

- private - tylko z klasy
- package-private - z klasy i z pakiety
- protected - z klasy, z pakietu i z klas rozszerzających
- public - dostępne wszędzie

Gdy rozszerzamy klasę to mozemy tylko poszerzyc poziom dostepnosci do membera klasy (zgodnie z Liskov subsitiution principle).

Pola instncji klasy **żadko** kiedy powinny byc **public**. NIe ma ku temu powodów, bo ktoś z zewnatrz mogłby manipulować wewnetrzynm stanem obiektu.
Nawet gdy dajemy dostep do primitive lub referencji do immutable, to sprawiamy ze aplikacja może polegac na wewnetrznej reprezentacji klasy, ktora przeciez moze ulec zmianie w przyszłośći!
Samo final przy memberze nie wystarczy jesli obiekt jest mutowalny, bo o ile referencji nie zmienimy to zmienimy obiekt na ktory wskazuje referencja.

Tablice ktore nie sa puste sa **zawsze mutowalne** wiec wystawianie tablicy jest bardzo złą praktyką! (np jako __public static final array__ - zawsze mozna zmienic element tablicy!)
Można to rozwiązać tak, że robimy tą jedną listę priwatną, a wstawiamy obok drugie pole które przechowuje inmodifiable array:

```java
private static final Thing[] PRIVATE_VALUES = { ... };
public static final List<Thing> VALUES = 
	Collections.unmodifiableList(Arrays.asList(PRIVATE_VALUES));
```

ewentualnie mozna dodac metode ktora zwraca kopię tej tablicy

```java
private static final Thing[] PRIVATE_VALUES = { ... };
public static final Thing[] values() {
	return PRIVATE_VALUES.clone();
}
```

**Ważne!** Od Java 9 mamy 2 dodatkowe modyfikatory w ramach __module system__ . Moduł to grupa paczek, tak jak paczka jest grupuje klasy. Moduł może **wyeksportować paczki** przez __export declarations__ w pliku z opisem modułu __module-info.java__. Member publiczne oraz protected nie beda widoczne poza paczką jeśli paczka do której należą **nie** jest wyeksportowane.

## Item 16: In public classes, use accessor methods, not public fields
Jeżeli wystawiamy pola publicznie nie korzystamy z zalet enkapsulacji - nie możesz zmienić reprezentacji klasy bez zmieniania API! Czyli chcesz przeimplementowac klasę, jakbyś opierał się na metodach, to tylko być zmienił reprezentacje i tyle. a tak trzeba przepisać klase + wszystkie jej użycia.
Dużo lepszym rozwiązaniem jest dostarczenie __mutatorów__ w postaci setterow i getterow do pol, a pole zostawic jako prywatne.

Jeżeli klasa jest package-private lub jest private nested to nie ma nic zlego w wystawianiu pol, jeżeli jest to czesć rozwiązania i abstrakcji na którym bazuje paczka - jednakze lepiej chować pola. 

Klasy nigdy nie powinny wystawic pol ktore są mutowalne. Jeśli pola są niemutowalne, to można ale jest tot dyskusyjne, bo znowu - udostepniamy wglad w wewnetrzna implementacje.


## Item 17: Minimize mutability
**Immutable class** - class whose instances cannot be modified

Comparison methods:

`==` porownanie referencji (adresów) - porównuje czy wartości w obuz miennych wskazuja na ten sam adres  
'.equals(otherObj)` w zaleznosci od implementacji - jezeli klasa nie nadpisuje to korzystamy z parenta lub implementacji w Object - np dla stringa porownojemy wartosc

Z defaultu robimy klasy immutable, jezeli jest dobry podowd zeby nie to minimalizujemy liczbe miejsc gdzie jakis stan moze sie zmienic, czyli jak najmniej pól klasy mutowalnych
Domyślnie robimy pola `private final` chyba ze jest dobry powod zeby robic inaczej

Zamiast konstruktora mozemy zrobić `static factory method` jak `Integer.valueOf(int a)` do wytworzenia obiektu.

Zeby klasy nie dało się rozszerzyc możęmy oznaczyć ją jako final, albo zrobić konstruktor prywatny - wtedy nie da sie rozszerzyć bo klasa rozszerzająca musiałaby miec dostęo do koinstruktora.












