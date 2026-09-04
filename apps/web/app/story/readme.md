# Story

La route `/story` est une page interne dédiée à la visualisation et à la validation des composants UI de Mythrart.

Elle permet de rendre les différents composants dans un même endroit afin de vérifier :

- leur rendu visuel ;
- leurs différentes variantes ;
- leurs états ;
- leurs tailles ;
- leur comportement responsive ;
- leur cohérence avec le design system.

## Objectif

La Story sert de **catalogue vivant des composants UI**.

Chaque composant doit pouvoir être observé dans ses différents cas d'utilisation sans avoir besoin de naviguer dans l'application réelle.

Cette route est destinée au développement et à la validation de l'interface, pas aux utilisateurs finaux.

## Organisation

Les composants sont regroupés par catégorie.

```text
/story
│
├── Buttons
├── Badges
├── Avatars
├── Navigation
├── Notifications
├── Search
└── ...