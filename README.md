# Gender-Star-Remover (English section)

This is a browser addon that removes constructions such as "gender stars" from websites.
You can currently get it [here](https://addons.mozilla.org/addon/gender-star-remover/) for Firefox.
Since this is targeted at the German community (I have not seen similar constructs in non-German texts yet),
the rest of the README is written in German.

# Gender-Sternchen-Entferner

Manche Schreiber\*Innen haben angefangen, mit Gender-Sternchen und ähnlichen Konstrukt\*Innen den Lesefluss journalistischer und anderer Texte zu erschweren.
Dieses Browser-Addon soll dabei helfen, wieder einen halbwegs angenehmen Lesefluss herzustellen, indem entsprechende Konstrukte ersetzt werden.

Der Einfachheit halber werden die Konstrukte nicht einfach entfernt, da dabei ein genaueres Wissen über die verwendeten Wörter notwendig wäre, wie z.B. bei
- Expert\*Innen -> Expert-en
- Entwickler\*Innen -> Entwickler
- vor Entwickler\*Innen -> vor Entwickler oder vor Entwickler-n, je nach Kontext

Mit diesem Add-on sieht es stattdessen aktuell so aus:
- Expert\*Innen -> Expertwesen
- Entwickler\*Innen -> Entwicklerwesen
- vor Expert\*Innen -> vor Expertwesen

Dabei können die Ersetzungszeichenketten sowohl für erkannte Singular- als auch Plural-formen von Nutzer festgelegt werden.
Grammatikalische Feinheiten werden der Einfachheit halber nicht beachtet.

Das Add-On kann von [addons.mozilla.org](https://addons.mozilla.org/addon/gender-star-remover/) installiert werden, oder mittels `make` selbst kompiliert werden.
