# Générateur EPUB Mythrart

`packages/epub` génère des livres au format EPUB 3 à partir d'un modèle de livre, de ses assets et d'un thème visuel. Cette implémentation constitue la v1 destinée au MVP du projet Mythrart.

## Fonctionnalités

- Construit une archive ZIP EPUB 3, comprenant
  - `META-INF/container.xml`
  - les métadonnées du package OPF
  - la navigation TOC
  - XHTML de couverture
  - XHTML des chapitres
  - feuille de style css.

- Rend les structures de contenu TipTap et les marques actuellement prises en charge, notamment:
  - l'emphase
  - le gras
  - les liens
  - les listes
  - les images
  - les mentions

- Inclut les métadonnées du livre, les contributeurs, une couverture et les assets pris en charge par le modèle actuel.

- Place les assets sous `OEBPS/images/`.
- Combine une feuille de style statique (`resources/styles.css`) avec le CSS propre au thème généré par `EpubTheme` (`resources/theme.ts`).
- Utilise [JSZip](https://www.npmjs.com/package/jszip) pour construire l'archive.

- Dispose de tests:
  - unitaires
  - d'intégration
  - end-to-end (Vérifie la structure EPUB générer via le officiel [W3C Epub Check](https://github.com/w3c/epubcheck))
  - performance

- Qui sont exécutés séparément. La suite de tests actuelle a été signalée comme passant ; les livres générés ont également été ouverts avec succès dans des liseuses web.

## API

```ts
createEpub({ book, theme }): Promise<EpubGenerationResult>
```

```ts
export type CreateEpubOptions = {
  book: EpubBook
  theme: EpubTheme
}

export interface EpubTheme {
  backgroundColor: string
  textColor: string
  textFont: string
  titleFont: string
  subtitleFont: string
  headingColor: string
  fontSize: string
  lineHeight: string
  paragraphSpacing: string
  headingSpacing: string
}

export interface EpubGenerationResult {
  data: Uint8Array
  fileName: string
  mimeType: "application/epub+zip"
}
```

L'appelant fournit le livre et les données des assets nécessaires au modèle actuel. Le package génère l'archive ; l'application ou le worker gère l'orchestration des jobs, le stockage, la livraison et les mises à jour en base de données.

## Styles et thèmes

`resources/styles.css` définit des styles de lecture communs et sobres pour les paragraphes, titres, images, citations, liens, listes, blocs de code, séparateurs, tableaux et emphases. `resources/theme.ts` génère les surcharges à partir du thème fourni. Les règles générées sont ajoutées à la suite de la feuille de style de base.

Les valeurs du thème sont des chaînes destinées au CSS. Elles doivent être validées avant leur insertion dans le CSS généré : le type TypeScript `string` ne garantit pas une valeur CSS valide. La prise en charge du CSS varie selon les liseuses, qui peuvent également remplacer les polices, couleurs ou tailles de texte.

## Pipeline actuel

1. Générer les documents XML/XHTML EPUB et les métadonnées.
2. Rendre le contenu pris en charge des chapitres.
3. Combiner la feuille de style de base et le CSS du thème.
4. Ajouter les documents et les données des assets à une archive JSZip.
5. Générer l'archive complète et la retourner sous forme de `Uint8Array`.

## Limitations

- **L'EPUB complet est conservé en mémoire** sous forme de `Uint8Array`.
- Les octets des assets sont fournis au générateur ; le package actuel ne récupère pas les assets depuis S3 et ne propose pas d'interface de lecture des assets en flux.
- Le pipeline n'est pas compatible en streaming. Streamer uniquement la sortie ZIP ne supprimerait pas la mémoire utilisée par les assets déjà fournis à JSZip.
- La consommation mémoire varie selon le contenu, la taille des images et le nombre d'exports simultanés. Les benchmarks existants utilisent un fixture de test et ne garantissent pas les mêmes résultats pour tous les livres ou environnements.
- La validation W3C et le fonctionnement dans certaines liseuses web ne garantissent pas un rendu identique sur toutes les liseuses physiques ou plateformes commerciales.
- Seuls les noeuds TipTap, marques et métadonnées implémentés par les renderers actuels sont pris en charge.
- Aucune taille maximale universelle n'est garantie ; le worker devra appliquer des limites de taille et de concurrence raisonnables à partir de mesures en production.

## Tests

À exécuter depuis `packages/epub` :

```bash
pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm test:performance
```

Les tests de performance sont volontairement séparés de l'exécution par défaut. Continuer à valider les changements d'archive avec EPUBCheck et à tester des applications de lecture représentatives.

## Pour la suite

Une évolution envisagée consiste à passer à une **pipeline ZIP en streaming** :

- Évaluer le remplacement de JSZip par [Archiver](https://www.npmjs.com/package/archiver), ou un autre backend ZIP adapté au streaming.
- Séparer les métadonnées des assets de leurs octets et introduire une interface permettant d'ouvrir chaque asset en flux de lecture, notamment depuis S3.
- Envoyer progressivement le ZIP final vers S3 plutôt que de matérialiser d'abord toute l'archive dans un `Uint8Array`.
- Conserver `createEpub()` pour les consommateurs en mémoire si nécessaire, tout en ajoutant un point d'entrée en streaming pour les workers.
- Vérifier les exigences propres à EPUB, notamment que `mimetype` soit la première entrée ZIP et qu'elle soit stockée sans compression.
- Gérer les erreurs, l'annulation, la contre-pression (_backpressure_) et le nettoyage des uploads multipart.
- Relancer EPUBCheck, les tests automatisés et les tests de compatibilité ; mesurer le RSS maximal et le débit avec des livres réalistes avant de modifier la concurrence du worker ou le dimensionnement du VPS.

Il s'agit d'une évolution future, pas d'une capacité de la v1 actuelle. La priorité du MVP est d'intégrer et de livrer le générateur existant plutôt que d'optimiser prématurément la mémoire.
