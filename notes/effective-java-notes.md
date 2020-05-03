# Effective Java 3rd edition
FIle contains notes from Effective java book


## Item 8
Java 9 usunela finalizery i zastapily je `cleaners` -- sprawdzic te 2 pojecia  
Zamiast tego uzywac try-with-resources i recznie czyscic obiekt/ nullowac referencje  


## Item 9
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


## Item 17 - Minimize mutability

**Immutable class** - class whose instances cannot be modified

Comparison methods:

`==` porownanie referencji (adresów) - porównuje czy wartości w obuz miennych wskazuja na ten sam adres  
'.equals(otherObj)` w zaleznosci od implementacji - jezeli klasa nie nadpisuje to korzystamy z parenta lub implementacji w Object - np dla stringa porownojemy wartosc

Z defaultu robimy klasy immutable, jezeli jest dobry podowd zeby nie to minimalizujemy liczbe miejsc gdzie jakis stan moze sie zmienic, czyli jak najmniej pól klasy mutowalnych
Domyślnie robimy pola `private final` chyba ze jest dobry powod zeby robic inaczej

Zamiast konstruktora mozemy zrobić `static factory method` jak `Integer.valueOf(int a)` do wytworzenia obiektu.

Zeby klasy nie dało się rozszerzyc możęmy oznaczyć ją jako final, albo zrobić konstruktor prywatny - wtedy nie da sie rozszerzyć bo klasa rozszerzająca musiałaby miec dostęo do koinstruktora.












