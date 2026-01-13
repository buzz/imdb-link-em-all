// ==UserScript==
// @name        IMDb: Link 'em all!
// @description Adds all kinds of links to IMDb, customizable!
// @namespace   https://greasyfork.org/en/users/8981-buzz
// @match       *://*.imdb.com/*title/tt*
// @connect     *
// @require     https://unpkg.com/preact@10.28.2/dist/preact.umd.js
// @require     https://unpkg.com/preact@10.28.2/hooks/dist/hooks.umd.js
// @license     GPLv2
// @noframes
// @author      buzz
// @version     2.1.1
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.xmlHttpRequest
// ==/UserScript==

(function (preact, hooks) {
  'use strict';

  var version = "2.1.1";
  var description = "Adds all kinds of links to IMDb, customizable!";
  var homepage = "https://github.com/buzz/imdb-link-em-all#readme";

  var SITES = [
  	{
  		id: "cinemagia",
  		title: "Cinemagia",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADH0lEQVQ4T4VTXWgUVxT+7tydzKi72Z/UkNTEGDSlMbCaqCCmIKHaEgumUZC+FWvb0IcI1hehERSi4IuIDxoRBEUF0Sr0RasoWlHTEBEURdKUNmljMMlkk83s7szeO/d6ZgUpWPTMnLlw7/Cdc77vu+yrn059P/TPZE8+X1jAABgGQ7j+Nxht+DICkys6UwBtxKLR/PKlVb1s895zUxmPVRS9PIQMIEupoLQuAYWAOWHjk7ohRJjEbyONmG/60LwMSVtPsx0nb81oFolLKaCUQhAoSMppz0LeEyj6PjzBcal9F66NrMexx1uQsFxC5rAMZNn2s3ccbURSgRDQ9ASaI1mWR2vsV0yoZXjqppG276C7oQfHn+/E0eEdSPBJcM4wj+sM+/ZKv6MMnlIEIFUIweApC7uW/IJWcz9cfyFVKsA0XDzMbcSFmW689GLIBjaUKGbYN5cHnIAAwhGSlolsUaCM2utetxrjT/fgM/MQmAEQJaUVlK6swTX/O1yd/SLDtv884GhupvI0a3phObYuX0Q/MlTHY7j9/BnaptYgRiOFAELbGPTacLPQgT/1KhBVGbbt/O8OCEBRBwGR2LbkA3StXYY8FUsMfQ28OAPBQgkl/vKb0PXyIiRJGSMleEAjfHrklsMMM5XNFbCiNonOlTX4uKYSCecq+OMfcGK8A/f99ThY2YO6yCi+HLtCHNngERI5kBnW2ffAsW0r1bIoiubaBJqq4+j/ewbDw/fQ8tEK9N714QuJD/koeuM/4sDsfozIelgRDSH8DGvve81BY4WFbc3ViFkcZwfH8GRCYHHCgksGcz0JVy3AYuMP+IpjXFaVZJRCZNjnfYNOQ1U8taE+So5TeDTmYs6XtM7BIMtyIpTekkeKuoxECGDogJxovpax9XC/k65JpjqaEhgYyeL0wAuU2xGycngbSp+3IrQ4IytrRR00996dbU9Xl8+ji3Lj2RS1G6AY6FLVdwZ1gKA4x1r23R7duKqhdmJqGveHZ8CpbSM0zP8Xf4Np2FHI3PS/rG7n9U0VqfLDuVyhkmlVmvV9wcipjJuTWnq7XwEH2WyeRGb3oAAAAABJRU5ErkJggg==",
  		url: "https://www.cinemagia.ro/movie.php?imdb_id={{IMDB_ID}}",
  		noResultsMatcher: "Sinopsis",
  		category: "movie_site"
  	},
  	{
  		id: "google",
  		title: "Google",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB00lEQVQ4y42T3ysEURTH90XZ9eT/kDYRLS8oP98ohuKBIvFC8eJNIQ8U2c3GvvhtbEh+JT8SL8rvFosnKTH7o1Vrmdmd+bp3dmbtj9E69W3mds/5nHPuPVenizNJkrJEUbQSPREJih6JJgAYdX8Z2TQQJxuSGIWTJHqt4GPqIPE8AvY5eNsa4KooAFdqgrelHp9L0/KeAjmKgaiZRe4N3mYGXHGOpnw9HdGVTER6VjN7mmpkR1d5PvxTZgg3lxAc1/DbLPA0ViH08hzfkZFmt9K/4OUY3FW54ErySNCVVvNa52GhgCe6CJ3mgF83IDDbjv8aiXVSgCBXcJCG4F4KJPdWjFNRvz9BveyXCuB/AfuGMMC1mRTQPR8LeKSLj5MMePbSsXY9/GfJfSvfMmB481sF3OuUCcP53RDK2ErksTW44G4Tgp2vIkoGwxUcO0MqYJwOkZEu+JCA2u1OZC9Ww8QyGL2axtm7g8DuMOlgUTFjReGAD622ACQpDCUjkKkOknyV759uMApES8zqCN58kprdHP2A9HQ85UrImS48bKBhtwemZUaupm6nC7ZbOwLBSO+H5JMa/wr1aiVJ7t6cEBz3sIx0wuiQ0GtSdE8PLNJzlP0AcUb9Jl4kdUgAAAAASUVORK5CYII=",
  		url: "https://www.google.com/search?q={{IMDB_TITLE}}+{{IMDB_YEAR}}",
  		category: "search"
  	},
  	{
  		id: "googleimages",
  		title: "Google Images",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB00lEQVQ4y42T3ysEURTH90XZ9eT/kDYRLS8oP98ohuKBIvFC8eJNIQ8U2c3GvvhtbEh+JT8SL8rvFosnKTH7o1Vrmdmd+bp3dmbtj9E69W3mds/5nHPuPVenizNJkrJEUbQSPREJih6JJgAYdX8Z2TQQJxuSGIWTJHqt4GPqIPE8AvY5eNsa4KooAFdqgrelHp9L0/KeAjmKgaiZRe4N3mYGXHGOpnw9HdGVTER6VjN7mmpkR1d5PvxTZgg3lxAc1/DbLPA0ViH08hzfkZFmt9K/4OUY3FW54ErySNCVVvNa52GhgCe6CJ3mgF83IDDbjv8aiXVSgCBXcJCG4F4KJPdWjFNRvz9BveyXCuB/AfuGMMC1mRTQPR8LeKSLj5MMePbSsXY9/GfJfSvfMmB481sF3OuUCcP53RDK2ErksTW44G4Tgp2vIkoGwxUcO0MqYJwOkZEu+JCA2u1OZC9Ww8QyGL2axtm7g8DuMOlgUTFjReGAD622ACQpDCUjkKkOknyV759uMApES8zqCN58kprdHP2A9HQ85UrImS48bKBhtwemZUaupm6nC7ZbOwLBSO+H5JMa/wr1aiVJ7t6cEBz3sIx0wuiQ0GtSdE8PLNJzlP0AcUb9Jl4kdUgAAAAASUVORK5CYII=",
  		url: "https://www.google.com/search?q={{IMDB_TITLE}}+{{IMDB_YEAR}}&tbm=isch",
  		category: "search"
  	},
  	{
  		id: "bing",
  		title: "Bing",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOBAMAAADpk+DfAAAAGFBMVEVPUU5hW0ZtYkGLczSkginElRnZoxL+uQNIeozOAAAARElEQVQI12MoBwOGAhUIxQihGKBUkRuYKmYQSQcJMjCwg6hiEMVUZgCi1AwYGMMZigwYGNzLgeoYzIAaygNFQdohRgMAOIQZ19+LH9IAAAAASUVORK5CYII=",
  		url: "https://www.bing.com/search?q={{IMDB_TITLE}}+{{IMDB_YEAR}}",
  		category: "search"
  	},
  	{
  		id: "ddg",
  		title: "DuckDuckGo",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACqUlEQVQ4y31TXUiTYRQ+m64uFpRdFRQkUZKY2nSmS8EpG1ZQ1EUYgVfSDyNCwqgIujBCKzW6MCKioDHFwCkZSf5mIBExtuncHG5+bU4zppN9m1Pc9vR+38R/PPDywnme5/y857xEm8ynkWu9xUl6r4rgySd4CwiThexWy/Q+zV4t7WRcYTL/p1gG/vNbxGPLWG+hHgM8Gjk4tYzfXlwkwUz1OZEcnRzH3Ku7cKUTxo8Spm/kY+FHh4j9e3ARXJEUG8WqJN7/7DqwGMFs/S3E/FOrmWfulMB1jOA+SZht0Ik+//ObEDSi2KWWl3Jl+0Rg+nYJONbzFpuwgGMB3ArCzP3LoosrS4GgJecZ6XCovw2hbwY4WaaFljo09QBDI1NYWo5hjpHf94URbG6AK4fgzCKEuj8h1G+EoCWnMpHRU5EF5wlCpPUFRgLAkbP1MPY5RCy30ghTSzvDJXCkS8FdPS36nbkEGlMkAoxlE8YyCHzrSwjv3/F9fF0PFkSHNIiZGDdK+PsooXEwDTlOrQRQJcGeyWZfmb9O6AbMhKUvrDJ2Ak0SxtsFe0ayiNqFAKMrFUxUKGBjDyU41yyKOAsQNhD8tTJEugjz79hor+SJqI0lJ1se6YPsEee79LCmESyHCfH5wGqI2ZrH8KiZ8IkE0zoJRlmCQGczgr1tsOWQnuyq3Vp7aUpiNDotzAfZJHo71oroHoQ9lWAo2iMulVd3IVF+6X4IWnEXhrPJ5atlCxTmMVl1CYGnVXjjK0dmrwYFg+ehHkgD1RxCsPoawIcxxbiCZsM2mhTEc/cSSxL/9RNfFxsh70xFoaUCja46vPYMiJjvYTkE7rb/4XcOua1KKXjjhy3LuNz+EXZlMqyMs+OPtCnpgCmTWszHKWJlPQvHnEYRC/MJ2Gb+f/b6WxPpu76IAAAAAElFTkSuQmCC",
  		url: "https://duckduckgo.com/?q={{IMDB_TITLE}}+{{IMDB_YEAR}}",
  		category: "search"
  	},
  	{
  		id: "qwant",
  		title: "Qwant",
  		icon: "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAAMwnrwDMJ68AzCevGswnr1rMJ6+SzCevrcwnr6jMJ6+IzCevK91tdgDqoks16qJLp+qiS63qokucAAAAAMwnrwDMJ68JzCevYc0nr83OJ674zieu/80nrv/NJ6//zCev9MwmsEf//wAB6qJLneqiS//qokv/6qJLqMwnrwDMJ68LzSeujM0nrvfEKLT/sCvA/6ctxvawK8DlwSm26MsnsKvEANEI6qRKOuqiS+zqokv/6qJL4OqiSzS3KrwAzieudMYosvqYL8//aDbs9FY596FSOvpHXTj0JJUv0SW+KLgY/8kgAeqiS5rqokv/6qJL/+qjTJ3puFgC0SasMsIptd98M+D/TDv980Y8/208Pf8GQjz/AAAAAAAAAAAA6qJLAOqiSwDqokts6qJL9eqiS//qqU/P6MZgIcgosoqEMtv/STv//0k7/5VLO/8FSjv/AAAAAAAAAAAAAAAAAAAAAADqoksA6qJLBuqiS5vqokv/6apQ/OjGYHafLMvJVDf5/0o6/+9KO/84Sjv/AAAAAAAAAAAAAAAAAAAAAAAAAAAA6qJLAOqiSwDqoks96qJL8emqUP/nyGK8aU3m5Dhz/v9BWP/VTDT/Fko7/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADqoksA6qJLGeqhS9nprVL/58xk3Sm5+OUW2v3/H8j80y6h+RQspvkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6qJLAOqiSxfqoUvX6bhY/+fOZeET2/7OFdv9/xvc9+oz19UwLtjdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOqhSwDqoEo06qhP7efHYf/nz2XKFNr+kxbb/f8c2/f/PtPEg/9kAAFsx30AAAAAAAAAAAAAAAAAAAAAAOuZRgDubSwB6qZOiOi9W//nzmX/585lkBTb/jsW2/3mGNz9/zXW0uplyYlTgcJcAWfJhQAAAAAAAAAAAOWyVgDaq1MB67RVV+nAXeznzWX/585l5ufOZToR2/8DFtv9gxjc/P0h2/L/T8+r6mjIg4FmyYYsZsmHEGbJhxFkyYgtb8eEhJrId+vXzWn/6M5l/efOZYTnzmUDF9v8ABfb/REZ3PygG937/Cna6P9UzqX+ZsmG6GfJhc1myYfOZsmH6WbJh/5kyYj/qsx1/erOZKLnzmUS585lABjc/AAa3PsAGtz7EBzd+nse3vriJ9zt/kTUwP9bzZv/Y8qN/2TKiv9kyov+ZsqJ4pvLeX39z18R585lAOfOZQAAAAAAAAAAAB3d+gAc3PoCH975MCHe+YMk3/e/L93n2T3Z0dhI1r++UNOxglzOnTCGx28DdcqDAAAAAAAAAAAA4BAAAMAAAACAAAAAAAAAAAPAAAAH4AAAD/AAAA/wAAAP8AAAD/AAAAfgAAADwAAAAAAAAIABAADAAwAA4AcAAA==",
  		url: "https://www.qwant.com/?q={{IMDB_TITLE}} {{IMDB_YEAR}}",
  		category: "search"
  	},
  	{
  		id: "yt",
  		title: "YouTube",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAq0lEQVQ4y2NgGB7gmaK4GhDvAeL7QPwOiL8C8X80/BUqB1KzG4iVkA3YhEUDIbwW2YBnZBhwD9mA7+gKfl268P9DRdH/59pKuAx4h2wAhgIY+Pf50/+vS+b/f2lniq7mL1EG/Lp25f/7vIz/z1Sk8BrwDd2An6dP/H+bGPX/mZIELi+8pWogbiTDgNXIBigD8RYgvgPEb4D4ExYNH4H4NRDfBeJtQKw4TPIRADVAMY00MJoyAAAAAElFTkSuQmCC",
  		url: "https://www.youtube.com/results?search_query={{IMDB_TITLE}}%20trailer",
  		category: "search"
  	},
  	{
  		id: "wiki_en",
  		title: "Wikipedia (en)",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA20lEQVQ4y62TjRGDIAyFZQpHYAgncBRHYAE3YAUWcA0WYAHHgN5HGy/Yas9a7nJKfl5eHtB1r5VzLles0+tqcQPya/EGchsgxliGYYBO8d5X5ziO235d1xrH+A8hlL7va05K6cmAgDGmLMtSZG+tbQDxSVfA3kYgSQekE6DzPDd+AW4AGAXafMUHC0zPTKNDEQnqhGmaKgvdxDl3DABdtEAcAQQA2gKotfh4jFCmC2DMyvz4KATg6z2gGyxkFDkhBNb6nF4kaGul6bwX7xRANNC2n/0v7+HWi5S6B3M1U+/DW+K0AAAAAElFTkSuQmCC",
  		url: "https://en.wikipedia.org/w/index.php?search={{IMDB_TITLE}}",
  		category: "search"
  	},
  	{
  		id: "wiki_de",
  		title: "Wikipedia (de)",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA20lEQVQ4y62TjRGDIAyFZQpHYAgncBRHYAE3YAUWcA0WYAHHgN5HGy/Yas9a7nJKfl5eHtB1r5VzLles0+tqcQPya/EGchsgxliGYYBO8d5X5ziO235d1xrH+A8hlL7va05K6cmAgDGmLMtSZG+tbQDxSVfA3kYgSQekE6DzPDd+AW4AGAXafMUHC0zPTKNDEQnqhGmaKgvdxDl3DABdtEAcAQQA2gKotfh4jFCmC2DMyvz4KATg6z2gGyxkFDkhBNb6nF4kaGul6bwX7xRANNC2n/0v7+HWi5S6B3M1U+/DW+K0AAAAAElFTkSuQmCC",
  		url: "https://de.wikipedia.org/w/index.php?search={{IMDB_TITLE}}",
  		category: "search"
  	},
  	{
  		id: "wiki_fr",
  		title: "Wikipedia (fr)",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA20lEQVQ4y62TjRGDIAyFZQpHYAgncBRHYAE3YAUWcA0WYAHHgN5HGy/Yas9a7nJKfl5eHtB1r5VzLles0+tqcQPya/EGchsgxliGYYBO8d5X5ziO235d1xrH+A8hlL7va05K6cmAgDGmLMtSZG+tbQDxSVfA3kYgSQekE6DzPDd+AW4AGAXafMUHC0zPTKNDEQnqhGmaKgvdxDl3DABdtEAcAQQA2gKotfh4jFCmC2DMyvz4KATg6z2gGyxkFDkhBNb6nF4kaGul6bwX7xRANNC2n/0v7+HWi5S6B3M1U+/DW+K0AAAAAElFTkSuQmCC",
  		url: "https://fr.wikipedia.org/w/index.php?search={{IMDB_TITLE}}",
  		category: "search"
  	},
  	{
  		id: "wiki_es",
  		title: "Wikipedia (es)",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA20lEQVQ4y62TjRGDIAyFZQpHYAgncBRHYAE3YAUWcA0WYAHHgN5HGy/Yas9a7nJKfl5eHtB1r5VzLles0+tqcQPya/EGchsgxliGYYBO8d5X5ziO235d1xrH+A8hlL7va05K6cmAgDGmLMtSZG+tbQDxSVfA3kYgSQekE6DzPDd+AW4AGAXafMUHC0zPTKNDEQnqhGmaKgvdxDl3DABdtEAcAQQA2gKotfh4jFCmC2DMyvz4KATg6z2gGyxkFDkhBNb6nF4kaGul6bwX7xRANNC2n/0v7+HWi5S6B3M1U+/DW+K0AAAAAElFTkSuQmCC",
  		url: "https://es.wikipedia.org/w/index.php?search={{IMDB_TITLE}}",
  		category: "search"
  	},
  	{
  		id: "wiki_it",
  		title: "Wikipedia (it)",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA20lEQVQ4y62TjRGDIAyFZQpHYAgncBRHYAE3YAUWcA0WYAHHgN5HGy/Yas9a7nJKfl5eHtB1r5VzLles0+tqcQPya/EGchsgxliGYYBO8d5X5ziO235d1xrH+A8hlL7va05K6cmAgDGmLMtSZG+tbQDxSVfA3kYgSQekE6DzPDd+AW4AGAXafMUHC0zPTKNDEQnqhGmaKgvdxDl3DABdtEAcAQQA2gKotfh4jFCmC2DMyvz4KATg6z2gGyxkFDkhBNb6nF4kaGul6bwX7xRANNC2n/0v7+HWi5S6B3M1U+/DW+K0AAAAAElFTkSuQmCC",
  		url: "https://it.wikipedia.org/w/index.php?search={{IMDB_TITLE}}",
  		category: "search"
  	},
  	{
  		id: "rt",
  		title: "Rotten Tomatoes",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACuUlEQVQ4y4WSy2uUZxTGf+9833wzk0kyMXRiHCVpYipGkmpSsSQqWIMrFypoU1eluyL+AbpS6Ka7dpN1obQgIggi0tJupO1CCN4iGi2EaLxkMpnMxbl8l/d9Txch8YLaZ3V4OOfhdw4H3qMT5/d4n50du83/yHmXefL7sf4Yqjf1rHZs59GPXw5+2jVz/8biOwPcteLbc5/Hg7TTLonYuEadUZEd9Z/Wkm19racTA63jwKkPEkxff2bH+jq/rqZiP7tpt/ferO+apQCnM7GlpSU+fHx3bv+RoW57YiD74Mq9vF2bU2vF5SPDe//alf41WdG9L3IJnI44L6qGXMZh4/06PfM+Tzd51Lq9u3vuNia/unRndj3g1u5tX8y1O7+NFrWXScWY7k9y8UAH47+vcHO0FcnEOfPDc1p8YTkO/+xIlkcWovGRmUcP1PNtA5mEL7Mq63Q/6o1zoyfJw6zHcCFkcrpGqWiYOpnlyz8qfDIXrO9uYabhMep6gXxDSnWrLpcd2SRDbS2gY1gx2I1xNjSEo9dKhGn3jeMpGE6EcthVlgmSCpV2UB0ezuYMKuWhVREph5CKGFyIePyRrA8LYEQIkAkXaMUCVkALEmpQCrRd9SzEBPryGgGsCCHQEKEuts1FWKYpSMVgiz5QBlch5RBb1kjNIhYEIRLwRXiJULaWujUFF7iKL8dtXq/iVTXEFFI3SEEjVYtexaUuQkUsK8awbCJE5KoqbtnqIdxGMUhCQUpBDAgE0xRCLTREqIqlZA1Fq8lHIaUw+PN8s35IARQ3b90OXAe6hFe4TRFqCGVrKBpDwYQsBj6F0P93g+vt+85vLK1/4nKuvwf4ScPBAKH2Fm4+Clj0m1SMvtDuuKd+jMLSG6+8pvlNffsrIpMFa8YKNsotRaFdCYMnFR39HYn8MqWjO6/3/wcnxm4ToFhoKQAAAABJRU5ErkJggg==",
  		url: "https://www.rottentomatoes.com/search/?search={{IMDB_TITLE}}",
  		noResultsMatcher: "Sorry, no results found for",
  		category: "movie_site"
  	},
  	{
  		id: "mc",
  		title: "Metacritic",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACc0lEQVQ4y5WT3UtTcRyHf05KEGRblptn7szpNt3cOWdzvrQQUbPVhYIXKUgalllmiFZChBhKb4baTULe6EWghvRGFwViIRjdCJapFXqmYok3/Q9PN6YZGvXcfx6+fPh8hdgDluygSxCVISoj/hWWLbDgY/R+Kd1Xj9F8KkT7BY1vEzmwJv1dxKqJoXsl5ObmkOzwIeIt+LQwgVAhh2wOGmvzYC0d5vzsGu66Usy+xHScHhU5NZWGM3X8orenHxFzkEiRAmvpOwXoEi8fFmO0ZqBo2SRJViRZBuDLwjwb6+sAjL9+hRBmGquD8N22LWExlUhJGMmZhcvjoqK8nIH+fgBcHg+S3c7C3CcAhkee4crwM/9C2xZ8GCvC6w8SE59ARVkZv3OxoQEhDGR4vczPzgJQc7qZ1lofRFMQLNkZ6SvFaHGiahoz09O8GR/nelvblqTlUhNCGCgsKKC3+y4Wh5e2+kLQJQS6kzutAXIPF28FqqsqiRWCc3XbJXZ1dGCTZWyyjFly09l8HPTNHiYH83BlKDwZewrAx5kZQqEQQhg4X38WgMmJCdLdbrKzg1hkLwOdpaDb2RxPJuE8BSGMPH08DMBKNIqqacQZjVRXVRIKhVBVhcysAD5/gI3JPHbM9u2jCCIumfhEC8/HRrdOPxIOY05KIhAIkJ+fj8GUxs3LR2HV9McWVhPoaY8gDEmI/Qd4PzXF4tfPBINBFFXF49WINaVRc7IQli27T5oVM2MPImT5fVjtmZglN3GJDlLSFPxqkI6WYli2wJyy90+gW2FRYehWmBtNBfRdO8Hg7RJ+vMuBFfN/fOWSA3Q76LbttnfhJ4iLvMSMlMT4AAAAAElFTkSuQmCC",
  		url: "http://www.metacritic.com/search/all/{{IMDB_TITLE}}/results",
  		category: "movie_site"
  	},
  	{
  		id: "am",
  		title: "AllMovie",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAuklEQVQ4y2NgoBSornr4H4SR2UAsgANjqEXW9AeJ/QkHxlCLywUfcGDcLkD3DrHeRbb1DLoByvIK3iCMbgCKWiTBJ8gGADWyAPEGKGZBM+AJQS8ANRkC8U8g/gViE/QCsiBQAzMQtwPxZSgGsZkJhcELJAPEgfgtEC8E4kVA/A4khk0tsgEnkAxIBuL/UEPeQdkp2NTi8sIFID4CxPJALAfER0FiNE8HP5DYD3BgDLW4kjLevECMa4kGAETOtCNo09TFAAAAAElFTkSuQmCC",
  		url: "http://www.allmovie.com/search/movies/{{IMDB_TITLE}}",
  		category: "movie_site"
  	},
  	{
  		id: "bom",
  		title: "Box Office Mojo",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUbHRuKAAOSChAtLyyYICA9PzxERkOhNTVMTktUVlOqRkZdXlxmaGWzW1t8fnvBdnaKjInGhIORk5CZm5jOlZagop+xs7Dbr7Djw8PT1dHr1dfz5ufq7On58/L/+/r9//yhFN39AAAAmElEQVQY013P3Q5CIQgAYGlsbuyIP6FSTXr/t0zq1EXMwfYNRIN94/kpwY7htYzGtxM6l2a98TGYywY+9Lqh99GVu8PgNqwV1s6sK5ioHzONa+cNlAzEr8vnFkIFUaorWaaHA2SQmEFhYsrvDkS5KApUEnJIQA7VIToIJcEJcw/W5DBnEoF4hwfudeH82jIFzz8ww3q+4y9ead4VRxi+M3oAAAAASUVORK5CYII=",
  		url: "http://www.boxofficemojo.com/search/?q={{IMDB_TITLE}}",
  		category: "movie_site"
  	},
  	{
  		id: "criticker",
  		title: "Criticker",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUCL10JNWIaRG8mU3tBZIlMaYlSbo9ZdZZYfZ1mgJxxiKV1jap3jqV6lauClayInbSPorqQp7iYp7qhssSot8quuce0wM25xdPBzNrK09vT2+Ta4uvk6evr8fPz+fv+//xEFJzNAAAApklEQVQYGQXB0U6EMBRF0X3LgWaUBE3m3f//M9/UOAJTbntcKz4AAOBX3u8aVyzg0a/rb22gzGNqOYwj5rojsvWiWfM07Xt0VLhtBQCi1h8rCgAA5fFMSmQHAJheNllEz2IMPo+rISY+AcC8vaYV9vuCMeRjNESwVADIvo4hQgYA4vTTCrIAAFFXLMJf35NmqcS1nzexaDjPw2Bt3WKmghmZ7bxa/QcJoVoLeA40rAAAAABJRU5ErkJggg==",
  		url: "https://www.criticker.com/?search=tt{{IMDB_ID}}",
  		noResultsMatcher: "<b>No Results</b>",
  		category: "movie_site"
  	},
  	{
  		id: "letterboxd",
  		title: "Letterboxd",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZ0lEQVQ4y2NgoAZQMnYJB+I3QPyfSAxSG45swAcSNMPwB2QD/pODB5kBE7Pd//9f7AnGILZXk/v/ooueYAxiJzUt+r/w4n8wBrExDIBphmGYZhiGaYZh6htAsReGfjRSnJQpy0yUAAALBG7oezCB8QAAAABJRU5ErkJggg==",
  		url: "https://letterboxd.com/imdb/{{IMDB_ID}}/",
  		category: "movie_site"
  	},
  	{
  		id: "thetvdb",
  		title: "TheTVDB.com",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAHS4GHywOLC8TKjgdOTIjOUcxR1Y8UktEVmBFWzhCXztHYzlRZG5Raztgcn1ngj5tgItxi0B8lEN/jpSDnEmIn0aOnqSiq7OuxU3Cx8rI3FTQ1djR41Tf5Obt8vX+//xpr4P4AAAAiklEQVQY002O0RKCIBRETyJGZUZSIgrs//9lDzbqfdszs3suHPd9ngLtOC7z+D6R25Lz3AI2hX8j5weAUwLgMt9fH8B6rc7hbNPA1cEkSeq1AhSBiyohUGTBat03Jnnw8jvolCDJHpYiY1RO2qhh0HQCvWJUB2A2I7XWsr1cFaOBqK0BQZKBXuqAHySZCuu3bZjlAAAAAElFTkSuQmCC",
  		url: "https://www.thetvdb.com/search?query=tt{{IMDB_ID}}",
  		category: "tv"
  	},
  	{
  		id: "tmdb",
  		title: "TMDb",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABU0lEQVQ4y2NgGDTAzMyMiZWVVZGDg8OWjY0tG8juYGFh6QNhIL8NiDPZ2dltgOIKfn5+TCia+fj4DJmYmC4xMjJ+BnL/48NANZ+Aas8B9WiBNXNycqoDBX8hKfoH5D8B4mtAfAGKQeynaAZ9B+pVYgA6cQFMEGjyO6CgCdAbQlpaWqwwF2poaLBycXEJA+UsgWq+wtQDvTOFgZmZ+SVMAKjIilBYAdW4wtQD9d5hAJr4A+qkb0ATVQgZANSkAfMyUO8HkMAbmInAkLYmZADQe85ILrgLCoMVSAHzgoeHB6c3uLm57YFq3sLUA/XOBJmoDQpR5BAGmvwaKLkd6KJlIAxk70B2KczLoBiERaU+UMEFQmkAzYAHQBfxoThRQEBAExiQ5UAblwMNPAQMpFMgDGQfBIqBXFMASqGgxATE74CulyAr2QM1ygCTdTIwSrkHPhMCAEsOaD3NT/fGAAAAAElFTkSuQmCC",
  		url: "https://www.themoviedb.org/search/movie?query={{IMDB_TITLE}}",
  		category: "movie_site"
  	},
  	{
  		id: "icheckmovies",
  		title: "iCheckMovies",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACvUlEQVQ4y5VTTUhUURT+7ntvnD+NkUntlaWG5ujk2PSHkqsYkNxILRqqXQUWMgtdSIuQUfuHhBYS0SKEgoagRbs2QRIatHBSh1cTUjqTGYXo+NO8effN6943PWvRog7v53LvOd853znfJWAWDocNSin+xyRJQiwWI6Szs9Ow2+3I5/Obh4ZhgANaoKIowmazgRDCDtnDflQU4J9fhsQdNE0zAbiDtW5o8KG2djcEQcDcXAozMwnoVIfkKAJhIKHEEnwL65C4M8/IX1VVUVm5A5HIRTQ1+c3MbJvXhNnZj7h7/wGS8WmcfJ/B9lUNsaZSkI6ODsOqQpa3YXj4JjweD7LZ7G/CzMNe7MLKl6940XoGxSsbiO0rQ8otQNB13eSqqjl0dZ2H1ysjxzgKrFTLiCRCXduAcuoSSpbW8KTZizkn641KCwC89KrqXThwcD8SQ3fwuuU0FmPPIbndLLoAlrgwiG8vJ9A8eg3lR1tAM2ugOgPg2bNZFWVlW1Ek2qEufkfmTQIz5/rx+eEzOFyl+HR7FOlHT1HTcxby8WOoLq9AllXMk0v8ozMk3mGIBvwj/SA2CamRx0j2DcPQKGaH7sETbEbdYDcjRM0p8cQ81qTAJ5BOp5FjVPTsD9Tf6MGWQ37Q1XUokevI5zTU3+qF6HYxgDySyQ8spgBiAnBTlHcYH5+Ay+EAKbKhLtqNvKqBrm+g4kQI3lArK7cQPDb2yhwxjxVlWY4WaOiIx6fQ3h6Cp6QYUmU5tOUMPIcD2HMlAgfLTtmoe3v7MD+fMqVsii8YDBpcA5wGb2ZV1U5Eo5fR1naEKdP+a5AU09NTGBi4isnJOJxOp6la8w0EApsAlqB0VmogsBc1NdVMyoT1Z4FV99bkzO+NqQ0WzGVOfD6fYUn5T+NAf71MlrjYmseYO42NjYY1jX8xK7uiKOQns5Rn5uMgMxgAAAAASUVORK5CYII=",
  		url: "https://www.icheckmovies.com/search/movies/?query={{IMDB_TITLE}}",
  		noResultsMatcher: "Couldn't find the movie you were looking for?",
  		category: "movie_site"
  	},
  	{
  		id: "episodecalendar",
  		title: "TV Episode Calendar",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAflBMVEX99PrgMZr74/HdHZDfK5feIJHeI5PhOZ787Pb98fjoaLXhNpzmWq7iPqDui8b51uvyqtXsfr/lUqr1vd/75vP86fThM5v62+3+9/vgLpjcGI3eJpT63u/qc7r40+niPJ/0tdr3yOTnX7HparbvkcndG4/cFYz///8AAAAAAACMev7qAAAAAXRSTlMAQObYZgAAAERJREFUGNNjYCAINNAANgF1JAAVkFBTE2NSU+OFC7CrQQBcQBVdQA7CZ4YLqIuA+FwIQ4GAUU0Gbgshh8F9gN03WDwLAPC0HDHwivrOAAAAAElFTkSuQmCC",
  		url: "https://episodecalendar.com/en/shows?q%5Bname_cont%5D={{IMDB_TITLE}}",
  		category: "tv"
  	},
  	{
  		id: "moviemistakes",
  		title: "Movie Mistakes",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACO0lEQVQ4y22RS2sTURTHs3EhdCkIUlyJoHUhqEs3bv0GRRCk4CdwoVLSZNI2aTptg8iUlFa70NlIqIvmMS0znUknhaS+IfThg8SaTJpMRoKmdiad47mZjJ2xc+HPvfd/z/2dc8/1+XDk83Axm4UWqoLa5/nKIPE3NuA27jXiS9JRTRSVmz6vsb4OQ2trALZ4Xi0QX5Ig5fRTqa8PPQGYYcENOIBcrnAG1yWnv7JSfe0JEEUoOAOJVlf3Iui33QD1+4nLm5vQh4Ff7CCO03Srip+qNesmkQVtgdf7z+Fh3crQBlFsPiNrQTBxDZBO17B5pmInSCTYgf/ffwkDDXKYydQBO385mQRYXra0tFR8guc7PG/tFxfLD4aH4QrLfuzrAmQZbtn0TEZpBYMwEAgAEI2MAMRiygImeceyAH6/5ZGZYbaGehUYjwRBx5INBJTejI7CPRJki6Lan2T58C1NH3sEMDW1F+8CBKHRz3GVGxxXvS7Luf7xcXjpBASDRjORUO84PaJwuJH3/NKxMShbQWZXgUAHpqfbrFV+xwE+3JEk+vQJAPagV7quowyyDoUOOgRA01XN7gOeKXNz78+6Ls/Pw1VHhnIk8id3XLYJ8fiHx46n/Z6ZKV1wAaJRuO8AfJ6d1QbtjLg/YpjseWyy2QPg0+rXXICJCXhhXwiFtCLxKOrfb/zY3fWdwh5t20kY5ttdFyAc1tIU1ahQVLNK09tJq6pfTylK3Y9Gt16R/eRk6znG1NCrxWJF/19hVVzTzfSONgAAAABJRU5ErkJggg==",
  		url: "http://www.moviemistakes.com/search.php?text={{IMDB_TITLE}}",
  		category: "movie_site"
  	},
  	{
  		id: "imgur",
  		title: "Imgur",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA8UExURSoqKmm2FIbHRmCxAT8/PTIyMSIiIicoJSsrKjIyMXzANnS8KTdEKU5yJFuQIHy0RF2iCEFWKV+CPHOeSaqlM1cAAAAKdFJOU+r///8Sh//+34hnFoC2AAAAaElEQVQY02WP2xKAIAgFqUy0xOv//2tqR6fGfQF3AIHUaWhirCLL+gNbMsjga3kLLpeSXcuoCwl7JaQhUn9X4yDyBeQV7G/gGWIDEFqGQIt28ejEMVSnbuL8ttaI94LFltWX45T9n/8AT98GJdi3gDIAAAAASUVORK5CYII=",
  		url: "https://imgur.com/search/score?q={{IMDB_TITLE}}+{{IMDB_YEAR}}",
  		category: "search"
  	},
  	{
  		id: "wtm",
  		title: "What the Movie",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAwASExEdHhwnKCYwMjBAQUBPUE9qa2l/gX6anJmqrKi+wL3O0c3X2dbg4t/7/fqY0FSkAAAATElEQVQI123NIQ4AMQgAwZVNEP0y/gRfwVfwJSRJxZ0orrdq3MKd6KPiwHRza6QpIBl1UI1RuwJg7FoLgDdtAxBpdeAN85n9EP9Z8wHGNSSyvcOg2wAAAABJRU5ErkJggg==",
  		url: "http://whatthemovie.com/search?t=movie&q={{IMDB_TITLE}}",
  		category: "movie_site"
  	},
  	{
  		id: "mubi",
  		title: "MUBI",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABy0lEQVQ4y32TTShEURTHD2EhIVEWFiwssLCYbChjQVFE8rUQSmYxhTQz771732iyIKRmaMZ9X8rKQrG2sxELygYbURRL+ViRr/PuPGZu5rl16/Xv3v+55/c/D8BteSEH4nIzMLle0NcCVaArrRDpL3C9Cz5PLhj0ADbCX3xrdInrTB4Bi7xzzaQ3sOwvz2ygBbp+L9vbIp8QaS8Ei14JukHCmQ2Y1CYcNMkbRDrzwVDOBZ1JQbcmssBSt53q79jzFFd1qQPNnpOm6gl/1b8rOl0JK75SQbPhxULV+JXtHBotBp1uIrQLMJUY9NfmJTmQYdDJKfa5j7qHa6uTFfiCXdxnqM06wBRN6EtTZIhLdWCoHykG6h2vqJM9kY0yCFj5UBB1sgWMDAiavecny7DyvViMLCAYWRENpCGer0Ee01I44q81VT0VIb4wITUmiTM6hhzWIRHq+YWVkGrwYhSji3BOPwPGyDSaJ4AFWv5PYNFXhPGNAgt2p4jbxjNeNJngQF2XHZVBLwUufA7S2jXpkxNnplEmvX8gmuMlaHorQqRzLqMcbBIvqy98PkxyLAIP+d3bsP9Ak75i1QeE1pdsYaoB27nmCRjKjm36DSPnHFZXIXO2AAAAAElFTkSuQmCC",
  		url: "https://mubi.com/search?query={{IMDB_TITLE}}",
  		category: "movie_site"
  	},
  	{
  		id: "listal",
  		title: "Listal",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEURExAnEhIcHxJNEQ8mHxVGFxNoEBEbJSaADw4jKhddHhGiDBDABg17HROPGQ8sNhjpAA3dCwslPkMtQCOyGw8wQxcvWmFCcVo5dH4/iplQnItForVRucpgvK9awdOV4DHk1f9XAAAAcElEQVQYGQXBQYrCUBAFwPqvk6ggCFnM/e82e2Fmp6bzrRrg9gO/JwIAEFwAYMG+TgAWlA7cz/W/wx4NtmWWsHGAN1eh9AEmLS6lgWaIB2/gwyrK+QQmc0RpwDFYskcDfBjZ+AOYJKVfNqCplAZw4gsc+SJZ/7PhIAAAAABJRU5ErkJggg==",
  		url: "https://www.listal.com/search/movies/{{IMDB_TITLE}}",
  		category: "search"
  	},
  	{
  		id: "hancinema",
  		title: "HanCinema",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACaklEQVQ4y3VTS2gTURQdxGWrUBG0LkJrd34oiAvtVosIVsWAVUFwp3RRsG5cFEXBlbUUDEbBgi4qBUVrF21K+lHMNJ0kM0maSWPTaIS000iaz7T5QD7H914m02mwFw4M98099717z+E4LSqVionAShAlKOVyOSjKOuLxv8gXCqA57Yz+Y+KMQRKdBCq0SKczcLklSD4/JK8PgltEPp+vHVMyldYYO+vFGVWFW/SCnxfg8kiESISDfPv8i6C3qiMxUQIrDJHY2IC6uYlkKo1obBV/VtcYaTKVQjqTMf5KSayUIGpMbm1l8WNmDjM9feDPXQLfeRnT9x9CcAookFnUEUQpQamWoO+cHv0EofUExMbDEPcfYZAaDkE4dhrfJqZQLBbhdHlQLpfZYDkjo+T1w3nyDMR9zXox32TCg/Yu9Jy6hrGuWwiFIwj9XIayHmc1OgFltL9+C5F00zsToo7zveBuDoK7MYiWq48xZ7MjmUwhIC9tE4ikcz5fwFT/0x0E3w+0YG/3c1L8oorrAxgeHUc2m8PEpJ3cJFwlcPALyJH3f3zzHkJjs9791dGzWvcqwR6Cz5OzSJEN+f0BOgOwIS5pb+IFD8xX+mBp68Cj4xfQZH623Z2gvdcKWQ5iJRJBjKyXDZGugl6JJ2vKZFS8/DCOhttD7M16cfcADt4ZwsiYjcnaMb/AtlFbIxPSMplumCCRSGDkiw0X+4fReteCtnsWmJ+8w1fbLBMUDVpsFJJJkyUWA0HIwRCTbCwWgxyQGRRFQalUqheRqpvKaKY14kAH72Q+CK9Edpjov2bazc5U0r9+R3X57mbnf8brH/ocK4DKAAAAAElFTkSuQmCC",
  		url: "http://www.hancinema.net/googlesearch.php?cx=partner-pub-1612871806153672%3A2t41l1-gajp&cof=FORID%3A10&q={{IMDB_TITLE}}",
  		category: "movie_site"
  	},
  	{
  		id: "kinopoisk",
  		title: "Kinopoisk",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJlJREFUOMutk9EJwCAMRDNKR8tUDuES/ffHQfwouID1pJEQ2lK1wgMJd1eTKjnnyMCVvVIMqDHZpYxbJd4YLdBsNgDm44NZOHrIFdC+7L0vOecG9mJ4qEcJYBFCICul1AOwlwWNOgmTHthEwE66NxwPYmBbuKsDehtWCKHxpvk3YLaF5SEu/8bpiwTv0lXWAcOPSXw0+pyt/gS3Kr6Pq2iRXAAAAABJRU5ErkJggg==",
  		url: "http://www.kinopoisk.ru/index.php?level=7&from=forma&result=adv&m_act%5Bfrom%5D=forma&m_act%5Bwhat%5D=content&m_act%5Bfind%5D={{IMDB_TITLE}}&m_act%5Byear%5D={{IMDB_YEAR}}",
  		category: "movie_site"
  	},
  	{
  		id: "cinemaoftheworld",
  		title: "Cinema of the World",
  		url: "http://worldscinema.org/?s={{IMDB_ID}}",
  		noResultsMatcher: "Nothing Found",
  		category: "filehoster"
  	},
  	{
  		id: "veehd",
  		title: "Veehd",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABTklEQVQ4y6WRoY7CQBCGJympQaAQV4WqICgMqhdqyJE0KCoQCBya1EMQJKg+wb0BEoNCYUifoLY0p2pKgrrkv91Nptnbo4LcJF/6z8w/ne2WgiCYCgoBXkTOTGg8HhcCmCyXy1888whuNBqNoDOfz3E6nXC/35GmKa7XK8qyxOVyQRRFMP3k+z6Y/X6vBmXEcQwiUqzXa3AcDgfoM+R5HiRhGEKP4XBYvUByPp+r3m63A8/RYDAAs91uK9Nms3l6guPxCH2G+v0+dGazGZIkUeYsy9Q9PB4P5HmO1WoF00+9Xg/PkBe0WCwq6nzkui7+A3U6HQSf3wqpzZy1Sdebqj45jlMVpTZz1vof0fvUbrdrt+g9qRm9Rq1W688WzvWe1Ixeo2azWRWkNvO6071131WfbNsuBGqzfDKc69/ONBoN9t3IsqyJ4EuAF5EzHz8jKv73k0dNqwAAAABJRU5ErkJggg==",
  		url: "https://veehd.com/search?q={{IMDB_TITLE}}+{{IMDB_YEAR}}",
  		category: "streaming"
  	},
  	{
  		id: "kinox",
  		title: "Kinox.to",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABQ0lEQVQ4y6XMXSuDYRgH8JsRIzYnPoUDh7KkpCS1edtKVmpZLUqkOZGZA452PPYSIQfL6mkemzTk9fBxprC8nMjH+HvuK4+u7ramdvDreul/XaLDt4JaCKc3jFoI58QyaiEc44vgwuksUXfpszt4onGoedE+ugAuVbgl1rxxeILH0idVNSuJNvc8uFThhsg+epCjY1nVnEW0joTAJU+vyfq+BuP1g6qa4UTLcBBcUr+iQ0swtgs1wwn7UABcQr+E8fKOyF4WsUye+u7ZVag507dJE82DM+ASuQscFe+p73SHoD8YNMv+N/Nk8gKok0TTgB/cTq5IrNk1F4Hx/Ia1dEbOxya7dUwPGvunwG1r54TvAltxWfP88O9BQ58PXJd/iSj7L5Oj7AObaxL/MF3umB7U946hipLJVvlBjwdVbFY6ln4AEEYVYRiE14MAAAAASUVORK5CYII=",
  		url: "https://kinox.to/Search.html?q=tt{{IMDB_ID}}",
  		noResultsMatcher: [
  			"EL_COUNT",
  			"table.SearchTable tbody tr",
  			"GT",
  			0
  		],
  		category: "streaming"
  	},
  	{
  		id: "ixirc",
  		title: "ixIRC",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAQAsAQBAAABPAQARExBhAAJ9AACSAAAfIB6dAAC0AADDAAAtLyzSAwDlAAA2ODU9PzxGSEVNUU9ZVVRiZGFca2tzbm1xc3B9f3yDhYKOkI2pq6iytLG6vLnU1tP6/PmPXyOgAAAAVElEQVQY073OiwFAMAwFwNf4V1FR9Ukq+29pCm6CA35ROQDMp8qJtZSAlipHKUuCBavjBU9z5/csZvfyAICncRr2LOshsJ4VHflm4O1iaIgq/SfRF0w1BK4hjJ+2AAAAAElFTkSuQmCC",
  		url: "https://ixirc.com/?q={{IMDB_TITLE}}",
  		noResultsMatcher: "<h3>0 Results for",
  		category: "search"
  	},
  	{
  		id: "xdcceu",
  		title: "xdcc.eu",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABQVBMVEVUtHMAAABTs3I4eU39/v1aur5aur4+h1VMo2hnvYJQp2xZur5aur5VtHNRs3BMsGo0g0fy+fRau7/Q69jI59JYurx/xpZRrm9YtnVUs3JVtHNVtHNVtHNVtHNYub5TtHJaur75/f1evMBau7/Q69/v+PLs9/Do9ezc8OLp9e1au7/i8/Naur694slkvsK54MW44cWt3bwsXjw0bkYwbkR/yclaur6LzaBaur5EkVxZuHdSs3BbuIzc7+GCyJxZub5Zur7L6etVtnRaur5VtHNaur5VtHNUtHJaur56xJBZur5UtHN+ycxVtnNKs7pZur7///9au79Yub1KmZw9g4b2+/vJ6erH6Omw3t2JztCBy85YtblUr7NPpalInJ9Bh4rw+fnu+Pfm9fXf8vPD5+l3xspxxMdrw8ZfvMBDio07en3Y7B2eAAAAUHRSTlObAJmv/erWqaCenpaQgjoMAvXy1tLMppuXjXhvbWIrGgr8+Pfz8e/r4Nzc19fNy8jFvr61sa+vraWlmJSEgoJ5d2pcWFRLS0M6NzMpJiUWEfo5O5wAAADgSURBVBjTRYrlcgIxAAa/5DhX3K3u7kaFuiXBpVC393+Acp1p2X+7syDuWcpOnbs5a05WDu8J8hkKYHcvKjjno1YBaU1Sqb441nzjlepD6ASJ+Iq0E2GMPberX31ughrqdmx8ENjr4OAWbLoZngz4oVZvcfkUTmyC/fHYMgvw9tmQ2RsCclQchulLgtxC498D83YepvhovvxqcGpJp2UovNdr1/wQNiQNacx0v7ufdf9fXpPiyGKj06+I98ZTMKKrq1ryGhdR0eFiZP0gARhJxwO52pJDSunOdbKZ41uP/AC+8TTXaEgFBAAAAABJRU5ErkJggg==",
  		url: "https://www.xdcc.eu/search.php?searchkey={{IMDB_TITLE}}",
  		noResultsMatcher: "No result found",
  		category: "search"
  	},
  	{
  		id: "filmaffinity",
  		title: "FilmAffinity",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADFUlEQVQ4T42RaUhUURiGj5QYqLlUk4kpRJGBgUKSGbhkpWK5NkaWWtgPTR0XslTMUMLIHB2dZshlCvrhlJQtaJu5JIUtmruW69wU3ENHTFDueTv3ThhEP7rwcM75lve857tkuN7RXN/ioEGHnW60xlbnf9CO02qrOQDcA62Ws90s4VydXbh3zc1iLCc7m7Ox3qQ74uX9Ta/Xh5HFFruHtMMRGI2mY88lGOx8ilUeKCqQw3aLBD4enujr7cPP5WWkJqdAYmmNE8HBmJ2Zwfz8/BJZ+WTL850uqzx3haLHlQLjNPeanFqYWdC9e5zo1NQ05SmlssRkSgihoUEhlInxPE8REBDYS2irDeU7nABdLObe7sDSbCuGh8cQExWFrZZWuJqVhR9zc+ju6mRuPLDT3oG5K2AXAdrK+zrCt24D3+kMTGRh8JE5ZOe80falF4sL88jOSIeVqRmiz0RifGwMczPTOC2VsmdY0dSkJOgXF3Vkvywd+xMvwi0+FvviM2DqmwT7SDkO5TzGgfRKmPilY71PKnadV+JoXi0c427DxPcyJZ4yOCVUDBASrIIBNUigklEM4n8T5HAeW/NBwlk8VGmIBTBCWT5cRRkgQUX9hJwohhGDHC+Ae2YV7jX1o7SuB5qGPqTdbYSQjytrQHldN9wztOwCOYykxVSIM74aBKTs4HcD0crXwmzw5kMf7tV+RK76KTZEqLEi/Ff2VbxsZ3XXWX3JvwTyEVnySiwsevwBceWN2B5bgQjFSywtLaOs+j3GZxaw+4KGWS+kouu/BaKUBoG2/u8i3ikatAxMio0y9QsxF11YI8yGij1/P+Gsqk4scksoBXG+BPtYjXge4ibROzIh7uvbR7Ax4hYloQpBQByiwc6xAnhmVeFz9yjckgWbckjzn+FJUxe8ksohiVIh7U4Dquva4BBTSklI0ZrACmNVEDI+WUKtz9yixlIFJWEKan5aRS1OsYEFyVmDgq5j098i5MOLeaGe0S0IVP6eKGtiq8GagTDF2ll0+ScvCAhrpiBgylAzRhg6BvcfDDGyGca/AHNTYBXQhFjjAAAAAElFTkSuQmCC",
  		url: "http://www.filmaffinity.com/en/advsearch.php?stext={{IMDB_TITLE}}&stype[]=title&fromyear={{IMDB_YEAR}}&toyear={{IMDB_YEAR}}",
  		noResultsMatcher: "There are no results.",
  		category: "movie_site"
  	},
  	{
  		id: "bluraycom",
  		title: "Blu-ray.com",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEVGmt1IneBKoOJMouNNpORPpeVQqOdRqulSrOpfqeNUrOpVruxXse9ZtfFdufR2uux+wfCFwe2Cx/Sby++czfCkz/Cg0/Wo1POr2Pes2vi73fXK5fnV6vno9P30+v3///8V2ZdfAAAAf0lEQVQYGQXBS07DQABAMWeYQiskPve/IYuWBUhAOnnY2wuIpKMJz+j4vS81MR/BZb+WQTjWwemchmC/Xe88VQNgbfypGTi9b8P+VU3CQKsy5GD93G3n1zQS9tvHNxcZAiykmXXi4TKfOTAFpzd0i7kUWL+fO7ZzpRJhVCoR/AMNol6wavG87wAAAABJRU5ErkJggg==",
  		url: "https://www.blu-ray.com/products/search.php?title={{IMDB_TITLE}}&year_min={{IMDB_YEAR}}&year_maxrange=20145&year_max=20145&year_exact=0&action=search&c=20&searchsubmit=Search&sortby=productionyeardesc",
  		noResultsMatcher: "Sorry, your search didn't return any results.",
  		category: "movie_site"
  	},
  	{
  		id: "myduckisdead",
  		title: "My Duck Is Dead",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAQAJDAgQDCAiHi4hIyE2ODU+PEpQUk9oaGaMj5Clp6S7vLvU1tPi5OHu8O38//uJC6zlAAAAX0lEQVQI12NggANGECEAxOwBQFwAYixgYOByAEldjWipBkkz7Xv/96UCiNH/7t03EIN93bt3N8GK/7x7dz8ApHhV34uVYBMl5+yaADF77isBCEOiBWobswGUwWTAgAQA1UYaf7VZ5TwAAAAASUVORK5CYII=",
  		url: "http://myduckisdead.org/?s={{IMDB_ID}}",
  		noResultsMatcher: "Couldn&#039;t find what you&#039;re looking for!",
  		category: "filehoster"
  	},
  	{
  		id: "vintageclassix",
  		title: "Vintage Classix",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAQAJDAgQDCAiHi4hIyE2ODU+PEpQUk9oaGaMj5Clp6S7vLvU1tPi5OHu8O38//uJC6zlAAAAX0lEQVQI12NggANGECEAxOwBQFwAYixgYOByAEldjWipBkkz7Xv/96UCiNH/7t03EIN93bt3N8GK/7x7dz8ApHhV34uVYBMl5+yaADF77isBCEOiBWobswGUwWTAgAQA1UYaf7VZ5TwAAAAASUVORK5CYII=",
  		url: "http://www.vintageclassix.com/search?q=tt{{IMDB_ID}}",
  		noResultsMatcher: "No posts matching the query",
  		category: "filehoster"
  	},
  	{
  		id: "rarelust",
  		title: "Rarelust",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAABIhf//+/AzBqZVAAAALUlEQVQI12NgAAEt0VAwEQAiQhgYRBlBBEMIkIsgwGJAJUDCAaaYFS4BVAICAGPrCMvSJcy9AAAAAElFTkSuQmCC",
  		url: "http://rarelust.com/?s={{IMDB_ID}}",
  		noResultsMatcher: "Nothing Found",
  		category: "filehoster"
  	},
  	{
  		id: "xrel",
  		title: "xREL",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAAAUFBQrKys/Pz+Hh4ednZ3/lgD/ogCurq66urr/uQD/wADJycnV1dXo6Oj9/f0GGqvHAAAAdElEQVQI12P4DwUMIOLdu3dgxr+bHXPfAxnvXhowMJ9j+P9mZgvX6g3zGP4dZlIQYNjQx/BvwgZu7l0LQIwFXAwMIEYTVwF7WQJQTUMBGwNI178JCWwsEXPeM/y7zKRgeQ9k8tuTM++B7fr37t17mKX/kRkAn3VZRBtqnu4AAAAASUVORK5CYII=",
  		url: "https://www.xrel.to/search.html?xrel_search_query=tt{{IMDB_ID}}&lang=en_US",
  		noResultsMatcher: "Sorry, your query did not return any results.",
  		category: "search"
  	},
  	{
  		id: "srrdb",
  		title: "srrDB",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAG1BMVEUAAAD/mWbMmf//mZm7u7uZzP+Z/5n//2b////v25rHAAAAK0lEQVQI12NggAFmYwNBQfbyAnwMOGBLSwgNZVJSwMeAAxYXh44OAgwYAABKGxMhLQ3j1QAAAABJRU5ErkJggg==",
  		url: "http://www.srrdb.com/browse/imdb:{{IMDB_ID}}/1",
  		noResultsMatcher: [
  			"<span>0 results",
  			"Invalid value for \"imdb\""
  		],
  		category: "search"
  	},
  	{
  		id: "trakttv",
  		title: "Trakt.tv",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABZ0lEQVQ4y32TPUvDUBSGM3TKbwiIJUhxLJ3EQTqIhFA6ODgUkSJSipQiIqWIdO7UUULp4A9wEOfi5CChgziE4uBYhPgLCvE9+l453kYDD9zknue9n3Ec60mLfhlcgxg8kZjfys5fDzpdMAb3YBfsgVMi7R32SY2bJ09BE7TBAmQ/rPv91EOf5x+i3WStqwMmlMe/xG+5B/EYhOADRAyZGLkC7jjyf3IAEpCBNp2KBERc87slX1jyM2VhgX5xIgmYcZP06Ofpmr+Fwj7lFyUbJGDm8Ij09M/ACdhHiMgPObJZRmwCWpS7lGugA+oIkSW85gS0dEAV3Cg5AEd8NyFzK6BqAkYgBLdKTsCSszAhgQp5wyaKM5KAEi9GSHmu9kOH1BgiR3lAp2TuwhD0WJzl0FUhG6wd6ptY4BKuvqZbxLGthsiom6yR2oL9P0jIADyCBthmWJ3tBvsGK7IV5IFLrjEhU37z7PpPB+SQTEVjedUAAAAASUVORK5CYII=",
  		url: "https://trakt.tv/search/imdb?query=tt{{IMDB_ID}}",
  		noResultsMatcher: "We found <strong>0</strong> results for ID",
  		category: "movie_site"
  	},
  	{
  		id: "kereses",
  		title: "Keresés",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAh1BMVEU2N2g3OGg3OWs4PW85P3E6QnQ8Rnk9Sn0/TIA/TYFAT4NAT4RAUIRAUIVAUYVCVIhCVotDWI1EWpBFXZNGXpRIYplIY5pJZZ1LaqJMbaVMbqZNcKlPc6xQd7BSerRSe7VYicVYisZajspcks9dltNgntxhn91hoN9jpeVlqehlqellqupmq+tAfB2qAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+ELGAwHKxlWugUAAACQSURBVBjTXY/ZDsIwDAS3JQTKFcJZ7hsK+P+/D28cgYSfPCPZXqMA5FtAATd3bE/TEBZPBUSJygewrgooe6WKAXxd794K8Huvoo8VBxUQJPyEAkfl9ehieWt4Bagu1b2VVmIrChTNLDp0JuNjEkjBhlhbMOSlWXCpnc2CZy1YFgxm0UcmGN2e27TPFHzu//0Plk8YeRdoW3MAAAAASUVORK5CYII=",
  		url: [
  			"https://www.filmkatalogus.hu/kereses",
  			{
  				szo1: "{{IMDB_TITLE}}",
  				ment: "1",
  				keres1: "1"
  			}
  		],
  		noResultsMatcher: "Nincs ilyen film",
  		category: "movie_site"
  	},
  	{
  		id: "movieparadise",
  		title: "MovieParadise.org",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABdElEQVQ4y33TyytEYRjH8eO6UdSMu2IxU4wFG7GUWymJUra2yl9hMyzcS9SUMllYoFhYsHDZUMTKpSxMCRtyFzZ8n+k3dZxm5tSn5rzP87znvTzjOJ5nKBqrxzQu8I0fXGEODU6qh2AxpvDrKtoQ+/2l2DxKvcUlWFXCHtqTfKAVO8qxScsTgSyMK7ACf5pV+rGu3Ank2mCdBmzP1UrMSFKch34M4FQ19Y4OzF7G0nzZVjmCa7RgWDWjFrzEEzrSTDCogld0oQ2POHZ04vcIpCiuwZsmOEHItooY3t0TBFVQiCga9b6r4n1UaqxWE7zYyzmetawADlRg19qn32fwuVbViQccOa7mmXR1YuKUb+0rqPJsK6x4OLFH7zXafR9qvMdTHLTDUyxkA5muq1yzllZiWfya/hf7EEmsON5IChRgS4FtNKu9s5FvvY8mLCvHcouS/Zkiriuzvp/FDDbxiQ8soCJdx3VjETeayNxhCb3Icdf8AfErxDzVutz8AAAAAElFTkSuQmCC",
  		url: "http://movieparadise.org/?s=tt{{IMDB_ID}}",
  		noResultsMatcher: "No results to show with",
  		category: "filehoster"
  	},
  	{
  		id: "justwatch",
  		title: "JustWatch",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABpElEQVQ4y6WTy0sCURTG/SuyVj03+Wj0zthkmqlTCpqSqVlpWqlRRBDmIoiIqFVrkdoF1aKICgqCjBYRFYRBbVr32EW0adPqa2Z8RDDEhIsL9x7u+d3znfNdhbK2ubaqTpXj15eyXg05S7gr5Ai5CnEjM1EClFOUXk4O6XCyxiIS0KO6QX4litIhldDj8bAdx1kjEmGCaIiWBSoDAt4W9Hkofq9CtJ/GyxmHiy07HN1/V1QGzIzpkVlgwLBaxEIEDwc2pCdYeFw0bvdcGBlqQ/VfgNlkQcLdrgmjgwSWTkqMO7sJPm58eL8OYDphgsdtkAYITZyfImhSazDcT/B0ymF9xYxgL4PsshUUQ0FDKHzmQ8htuGE0638D4oM6zE0SNKo0fAMJnnMcNlY7MOA3ILNkRQv5AZxv9sBsIdIS8jtmxMM0ujidGHcUJbxdFST0elqlJQhjzC4yYNu0YgX3+zakxll43TTy+y7EI0bJaZQBQS8FX0+hcQLglR/j5bYdTgeRN8Z0UcKRaCQasQEaNXKMVLLyeKRg5bD/n1au+DNV+p2/AWWoo5tG2eI6AAAAAElFTkSuQmCC",
  		url: "https://www.justwatch.com/us/search?q={{IMDB_TITLE}}",
  		category: "movie_site"
  	},
  	{
  		id: "ofdb",
  		title: "OFDb",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAXVBMVEWLrJsAAAAICAgQEBAYGBghISEpKSkxMTE5OTlCQkJKSkpSUlJaWlpjY2Nra2tzc3OEhISMjIyUlJScnJylpaWtra21tbW9vb3GxsbOzs7W1tbe3t7n5+fv7+/39/durR4nAAAAAXRSTlMAQObYZgAAAJdJREFUGNN9zrsSgyAUANG9qEQFFeWlGPj/z0yTmaRJtjvdwu/KYdby5WxNSqV9PLmzk0cDuPxWrtnZKKIKXPNuB7vZrbulWzJ1tNRJm6SG6q8cif0Ou86zPrTrY2brPIT+PnLwsgaY1AFxDIMYP/obBm0hWyMyBX8CDxkzbXeiXDwB1l4thdpCSk8A/KJsBGp9L7d887cXwiQI7Haln38AAAAASUVORK5CYII=",
  		url: [
  			"https://ssl.ofdb.de/view.php?page=suchergebnis",
  			{
  				SText: "{{IMDB_ID}}",
  				Kat: "IMDb"
  			}
  		],
  		noResultsMatcher: "Filme:</b><br><br><b>&#149;</b> <i>Keine Ergebnisse",
  		category: "movie_site"
  	},
  	{
  		id: "omdb",
  		title: "omdb",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAw1BMVEXQAABMVUBJVzxQWD5KWkNQWkVPXUFQXkJTXUdVXUNWYEtTYkZZYUdbY0hUZU5YZ0paaUxca05gb1Jfb1hicVRkc1ZoclxndllreFVufFlqflpvfmFxfltxgGNzgV1wgWl1hGZxhmF3hWF4hHN4iGp+iHF3jGZ9iXh9jG5+jW+DkGyCkXOFlHaDlXyIlIOMk4mUoI6YooqbqJaZqpGss6izuKi6urG3vrO8w7jR2c7d3dTY4NTu8O3x8/D09vP7/fr8//vLkyKIAAAAAXRSTlMAQObYZgAAAJ5JREFUGNOFj7EKwkAQBd/u3amgpQFBK0EFCYj4/9/gBwiCWNoIYhJzt/sstLFyymGaAf4hAIBDXxgGx6+o2WYpJBjjBYJ1hpHiRnNOT7LtHFVShXt/dkZV+mycgmhMkxUtaGcIEBFCGCzfFXAnCSGEVNUhrPVPYM+c54KFMVVJ4P21KV4L9rdiBtLMzEeNAFhq+zIyhu4B/o5sdvjPGwnlV+zcaSreAAAAAElFTkSuQmCC",
  		url: [
  			"https://www.omdb.org/search",
  			{
  				"search[text]": "{{IMDB_TITLE}}"
  			}
  		],
  		category: "movie_site"
  	},
  	{
  		id: "startpage",
  		title: "StartPage",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAwFBMVEXaWEjdW1DYXU/aX1bbaFrabWLgc2fbdWxwlc50mNJ5mc3ignbXiIbdjIXXjorkjIGKptXck47clJWUrNeYsNvmo5vXqa3cqaijuN3prKOpvuPrr6zkub2zxeXWxMy5y+vVzNnjytTD0uzsy8vG1e/pztLi0NjK1urN2u7g1+TY2ero1t/S3vPW4O7f3+nV4vba5PLk4+7w4+Tf6ffs6e7j7fzm7vbe8P346+zr8vvu9f7y9/nv/P34/f///P/9//xWYzz0AAAAtElEQVQYV2XIaxeBMByA8T+KLVGIZuTOXEbrNibV9/9WOjq8yO/Vcx7gNfA3/BrwzxPTnJw53XmOsyyH6LcGQ73HkG07NqICTk33ntwOR0REJAhiEHQ0dx0kHG9kIjnyQF56GuhzvxxSRgYB9VTx3mqsMFNKCexBvI2fry0sMFWpovgKYbs9Hmvdm2GP6Ah5KWTh1LJmj8hgjJBjmkFWkQYv8rwMyD/KcS0+BUUlY2kV3/HzBux7KSPo0YVRAAAAAElFTkSuQmCC",
  		url: "https://www.startpage.com/do/dsearch?query={{IMDB_TITLE}}",
  		category: "search"
  	},
  	{
  		id: "moviedbme",
  		title: "MovieDB.me",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAYElEQVQ4y2NgGHDgsnpiJhCvJBNnggxYSYHlK2hnAFDcCIjTgJiJXAPCgfg/EB8BYh1KDADhY+Qa8BmIC4GYhRwDxIBYlj6xAHUuOXgFLLrCyMRG2JylDTIZB9ZmGHQAAIx3sXcNkddPAAAAAElFTkSuQmCC",
  		url: "https://www.moviedb.me/search?query={{IMDB_TITLE}}",
  		category: "movie_site"
  	},
  	{
  		id: "rarefilm",
  		title: "RareFilm",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABt0lEQVQ4y3WTXSiDURzGDxrSmiXErQtpKS5dUYiL5Ua5dSGXLiS50FrMsM1MrZlSKERyZZTt9S0f9z5aY+NKQ01qhvbxPs5539K29+zU/+J9z/N/zu+cnj8haQuJ7yIEPHrsDzjhrAlisviH1jdctX74Bh0IejuR/C0kvIWv1woIQ3ZYtR8wEWAuD7geAny9gJl+s38z5e/iicGEn49SZfNS06UkSq+zRmAtH4r/q61H/yYSNjs5W8Tqxg7sqMHZS+HUOE6voyJiwNMl2soiCpGNVmgLuGoF19xe+YaQ0E6w27/IFbjoG4S3ZQrePqM4HLEQzFa9cAUrWiAqyBQ2rgFEt+6ewJSf5BpsNADxgEzBaHgai+Yzt8FONyAmZApGk9Mg1xUuekAdZApGw9O4dXe5HzHYJxswCkbDe8Tj0QmChz09S5hCEJmRDVgxmux9Rv583CIFSRSGrQpByEB740AiDAjNnCCNGZGKF8hpjL2XK6K8XE0pzoFHMz1Nldm83uFVzgMzORixZFxnUwM40hpnq8JShLObM8aZjSwb3fk6vzhVEsO0OoqF+luaumnx6bBNyn/a+gNsGXUWDpJOWQAAAABJRU5ErkJggg==",
  		url: "http://rarefilm.net/?s={{IMDB_ID}}",
  		noResultsMatcher: "Sorry, but nothing matched your search criteria",
  		category: "filehoster"
  	},
  	{
  		id: "wipfilms",
  		title: "Women in Prison Films",
  		url: "http://wipfilms.net/?s={{IMDB_TITLE}}",
  		noResultsMatcher: "Not Found",
  		category: "filehoster"
  	},
  	{
  		id: "clubclassic",
  		title: "Club Classic",
  		url: "http://club-classic.com/?s={{IMDB_ID}}",
  		noResultsMatcher: "Not found",
  		category: "filehoster"
  	},
  	{
  		id: "tvtropes",
  		title: "TV Tropes",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABp0lEQVQ4y43TvS8DYRwHcNKINCIGaQzSiDTlrkVVuUs3RIlJTA2L0G7SQUz+AoOI0SAiFpuhkzRE610HCcJgqGrkSFUjBuFHmsf3kadypeWGT+7yPM/v+7zcc2WMsXI9ijRZ6MjpppSn8mdfMWXfhVvNVtqWpunYGafrDo0y6rihAIrJFbQj++nQcUYXrhxpXYweVY6HDP4fsCs7ad+RxLIZ3XgYZdV8AJdEyBClFVPpgKhkgTiWz+i8TV+cl6KM4v7zDBCw9BVwjFWklYLit4waogfF/GfAW1SaQgh735PZx10n38YzildR3GroK1BMGkNILhV2sVi4O5HVvD7G5Arjn3Hfbjtd6wwNj4ymPQMTWktvcKHdF5hx9wdswJ9TUMXH4umHWbAX3IO2vqDV5Qsk0fEKVxDhg2ATnsAN1RCHFDQWBKDBCrdiAH+vEe18dgYh8MILrICpVMBBfrmiXYZ72IA5IBj6dZXRWA8JuBRhZj6LsCy2loUjqC0WwAvWIQcn4gxk0dcDz2Irk0V/JjGwGeYhDIvQoAufFqdfVzJAF2Qycge4TwCQaMiplLfGAAAAAElFTkSuQmCC",
  		url: "https://tvtropes.org/pmwiki/search_result.php?q={{IMDB_TITLE}}",
  		category: "search"
  	},
  	{
  		id: "allocine",
  		title: "AlloCiné",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABVElEQVQ4y2NgQAL/zzIwA7EQELMiifkB8VUg/g7ExQy4AFAyC6rwPRDHQcVYgXgdEP+H4iX4DOhEUvgViDcA8TEg/ockfhKIGXEZEIekEIHPofCfAzEPLgMs0Gz7//4g8/+5DRL/Ty7hh4n9BGIVXAZIAfEXmOafJxn/F8XL/VdTVfufHyv3/98ZuMGuuAxgB+K7MANOLOL/r6et+j8hUP7/vS0cyN7IxReQe2H+7i2W/t+WL/3/H2a4TMdnwDSYwpQQ+f+ru8XQAxGE9+MzIBvmgoxw+f/WJir/Ty7mQzfgPsi7uAxwhhmwuFUcHIAzaiTRXQFKI9K4DFCGRhU4CmfWSv4/u5wPmzescBnADcTPcCQiZJyAywBGID6BpPAvEO8D4mVA/BlJvAtfQC5GUrgSiFmg4uFA/BKIzwBxCj4D8oH4AxCfBmIPJHEWIOYFYiZk9QDcNJJsMRjsPQAAAABJRU5ErkJggg==",
  		url: "http://www.allocine.fr/rechercher/?q={{IMDB_TITLE}}",
  		noResultsMatcher: "Oups !",
  		category: "movie_site"
  	},
  	{
  		id: "pb",
  		title: "The Pirate Bay",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUBBAAbHBonKSc+QD1QUk9cXltvcW6ChIGPkY6ho6CusK2+wL3P0c7a3Nnr7er9//yio7pYAAAAeUlEQVQI12P4DwUM/68YA4ElkLGAAQhYwAxGBgZWEEMn6upyMMMuUOk4SGoCSA0zmCHAxMD0n+FYA7MjqwFQZEPFrJUzV61rZSgwjjj///V0YYZtlomMhsLBSgz/GE0iSpQToxn+ib3///91wHmG//tAdl+5zwBzBgA4/kVfY3CNqAAAAABJRU5ErkJggg==",
  		url: "https://thepiratebay.org/search/{{IMDB_TITLE}}%20{{IMDB_YEAR}}/0/99/200",
  		category: "pub_tracker"
  	},
  	{
  		id: "demonoid",
  		title: "Demonoid",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACJ0lEQVQ4y8WT60uTYRjG/Vb/QlH0sUYfjCKyliFviY03rC2Hug4QUhDFIlAsFjppqUVHtSzXac1lbVLu4HknYypt5dZpa01dX6K0/gBR8Nc7o/KlpPrUDdfDfbzgfrjurKz/aYIg8MP5jr8dlPVnnEeBHTj8IvOLC8HWkythg5zAbFfhHdHif6HlnlvFk7iO4dReQkmdhFI6hzRSXsQ1KPLQq6T+erac4HyLgC+mpftpEZWnN/F4QMPAmz30j5RIKMYfK6HJmk+TbT3OQYED+mXIdqptKMAbLaI3oiX4qpTga500qMN4YQs9z4roe66lI7SV9kA+tr61iOqVcoK6a7lzK3iju7H7tnPHmU9rp8iDXjVt3cW0OJRYu3Jo618n1fMQxCXfVsg89n4VPeFCzO0CVXUiLbcuEQwGMJlqSCbf8enjZ8w3zZQd0lJ7pZCLFgW3PSt+Ely+q6TqXAGmMzV0d/mYnPxCxlwuF2Nj40xPz+B2e3A53QwPRdmlKaC6Ybn8E22tDhLxt6Tfp4nH44yOjpJIJAiHw6RSKfx+P7FYDKezA4vFhrBts1w3mSAafcnU1IzU5CQUCjE7O0sgEJiLJyYmiERGpGErjY0Nv4oukzisV+MN3qeiohyHvYP0+Aeam82cMlTj8Xi4esOISsxbWLGZgqFuIydqV2M4q+Bk/SrJV3DcuJT9+sXs3Lfoz3KfL9myo9kcKc/h4LE1/3QrCx/Nb+wr7suzQv3uXZAAAAAASUVORK5CYII=",
  		url: "https://www.demonoid.is/files/?category=8&subcategory=0&language=0&quality=0&seeded=0&external=2&query=tt{{IMDB_ID}}&sort=",
  		noResultsMatcher: "No torrents found",
  		category: "pub_tracker"
  	},
  	{
  		id: "ant",
  		title: "Anthelion",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1klEQVQ4y42TwUtUURSH3wwmjaERmaitTFyENptQykUKLUQR9M0IKQQiGjaIvRltUSokShBJEQiCJAotpKhJF0nQwkWG7z1nFFeRf83xuzMnfQwqc+HjXnjnd87vnHufZZ2zkllx4Ag86IDf0GYVuwi2YQtmYEWTbcP1C4UxTy7FXLlpu1Lb70ppKitliJZgDx7CL2g/W+hJC+I77HOwCJNxX649zUgY0W34oU52nKxcPRH37EiI4JewAe/7fAnHXQlz7oHX8PyRJyUIF9TBQHJf6k6ru3KDoFFIQ6/tSQN7JbzVpIZOhBUwDD/hG0lCVmw3V/0NSaL0Xc25G77DCph2vmqCd0N7EkKY1jYOkxkptey81XVTWWfxAL6o6LGxr+d1nJlZjMEarDr7zIEPJsEaDlrYZyEBjWBrgnIYgSdgHPTBNEzRQsRKeLkWzMd7gX6N7Ym4J1fU1V1oR2QSbGoLvnMgJfkh+hIhYDCQYAa7TXoDZv9Eq/VUvIXwryZYLnwH9+EzvIJmncuGDrI1eZC7xo8qNnSd9ZhqqFzF/gLm1dVlJ399HwLidOq//fPWs2yuonl94/AnIPZppb6Yn2kQ/gWEhl2IFvs3DgWEJtEilWsK444BTh3iFHeb1N0AAAAASUVORK5CYII=",
  		url: "https://anthelion.me/torrents.php?searchstr=tt{{IMDB_ID}}",
  		noResultsMatcher: "Your search did not match anything",
  		noAccessMatcher: "You appear to have cookies disabled",
  		category: "priv_tracker"
  	},
  	{
  		id: "hdbits",
  		title: "HDBits",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEVIX25NY3NTanpacIBgd4dofo9wh5d4jp+Gkp+Al6iKnaiHnq+Qo6+OpbaVqbSWrr+dr7uosLidtMahtcGju8yxucKpvMiowNKvws6uxdfEzdXT2+Th5unq8PLu9Pb5/Pv+Czd4AAAAeUlEQVQYV2XOMQ7CQAxE0e+1BUkQDQUS978dXUAoBMVjSpTld/OqsRv7Qj1kD6IJmgjYAD8Mw1J1xocWRz4VEgJUNTOO72xKJJFCem2TQmkXsKQEZQpJd7gKBJSiRAGCAp/rBzbZKRe8FSvYKnc9nmC++wluPXT7vy9af0MJGITqXwAAAABJRU5ErkJggg==",
  		url: "https://hdbits.org/browse2.php#film/dir=null&searchtype=film&actorfilm=film&search=tt{{IMDB_ID}}",
  		noResultsMatcher: "Nothing here!",
  		noAccessMatcher: "Recover password",
  		category: "priv_tracker"
  	},
  	{
  		id: "asiandvdclub",
  		title: "AsianDVDClub",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADQ0lEQVQ4EQXBfWiUBRzA8e/z3O12Lzu23Xm3u23Osems9sJNLeNgUjFJYwMpSqaGOBe0YVBEkEW0oj+yAg0GKxpCNjFQxqQgUHwpS3Eb3dhcdGfumrfmvN3tvD33tue8+/X5KIDv7WoCRQMA6BlQBMwlUN5qQGltRr91B6XShJLKsTIDmCAThzNF2pVP3tgnb1bbiAydJRYHqxMexWEZEMC3A54ZfJpCLEZeS1CYz3D/ks66AkN/gZq4PI7Fm2R77A86b56k5gkLrnKoVqEcuDIFH3dNkpwSSp8/QEmVQl1XKSpgdoBhp5XB1tkQ2vBpVHsI78gXuHxu1Ft/ks2C+zFYgJGJJLvSSWz7+jCaQ8g/GpM6qJX7X8R9Yoj4A/j71L8Em45gSgfYOn0C/4CTCgt47LAX4f3vQ8iKhaKpCtnopJgFBkzI0m6jyMPTcrfHJ2Mgn4MEe+wi2qeij2yS4A7kNwsyCDJVjUh+RlY/apBjbkR1vdZAwuBmYlMvdd129owfxA+MndMYf/YrSo5eoKHXReML0OGAySUgkcawcTP5LKjTo/PknTp1x32MHbjB6q+X6Zg7RKcV5uY05l4+jLF/CZvAkx3Q5oFiJAw5B0UV6HUiNzYjPzRZRT/rk1GQ0Kt2kem3JNyMfAaSv3lGUiOHJLgNCW5BirOvy4PDVXLUiqiqDotRaDZnGH1vlle+beH2eY3UrFC+10/Pbggc/wDbc93kY5DRQHF6seUeYnOCcVWDRi8sRKBpQ4HbPy3T1V/Ptb4hulMzhBxt1G5fBI+dxxkw1QCJFPEwFNZAdVXCYhQqTFBmg3s/xyjtaKPGApnxi9i2WInNAws/oprBNfAua99dJL0M7v1Poa4mwOuBdBLCM+Bvg8CpS5i21bIyfpKyRgeKE9Z+z6Mq4OpMEzn/H553XqKQjKE6N8DaChRVcNpAy0B8IkeZLUZWL6GYXqe+v4+lby7gPuLn0fAvGL0WKvzNaNejqI56qPSAqQgpHfQ4FIDo3RyVDV6S11awtDlYX8jjOthNZHiBreeOcb/vS/QcKIDvwxYC4TtgLQd9HQo6KCao3VVNejGPwaBibW4hdfUKlp3tqNEgmXsZvo7R/j/9YmflnDmXVAAAAABJRU5ErkJggg==",
  		url: "https://asiandvdclub.org/browse.php?search=tt{{IMDB_ID}}&descr=1",
  		noResultsMatcher: "Your search returned zero results",
  		noAccessMatcher: "Note: You need cookies enabled to log in.",
  		category: "priv_tracker"
  	},
  	{
  		id: "kg",
  		title: "Karagarga",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACeklEQVQ4y2NgGBng69evIq0tLVMyMjLWnzl92o8kzX///GGNioo6w83N/Z+dnf2/tLT0f6BBJ8+ePRuKV+O/f/8Y3719q5mTnb1fVlb2v4SExH9GRsb/+vr6f5WVlf/b2Fj/2b1rdxayBqarV654LFu6tLamunqjn6/fM11d3f8gxfLy8v9FRUX/W1pYPv7165fo1y9fFL5//y7+88cPAbDm27dv+wQHBT1SV1f/r6au9l9JSem/goICGINsl5OX+6+hofG/q7NrLoZTt2zZUhYdHX3T0NDwv6am5n8dHR2wASCNIKysovxfVVX1P9Dwvw8fPjTBMMDT0/Ojtrb2fyMjo/++vr6va2trt9ra2PwGGWRlZfknPDz8UnVV1bobN244bFi9sh8ULk8fP/a4df26L8jbDF5eXt/9/f0fAwMkF+gnPpChe/bsqVm+bPnE5cuXzwUF5vZNGydtXr+ucfG8OZOXzJszc+HsWbNfPH+mD3bB9m3bWl++fKkCcxEwcESnTZu2ft26da0rV66cNHnixKXxEaEvp03o275u5fJ5J44eKf/29asMyGAUr/z+/ZsbGOcsIPaZM2eiqisrjwf4ev9Ijo978PLFC1OQOFCj2M3r13y2b95Ueu3KZdR0cPbUydJnTx5bHjmwP7O2vHRfkKfrr9nTpy569+6dBq50AmasXr60Iz8j9WRiZOi7/PTkO0VZ6VfmzZi2srul8RDQsPRVLS2757a27rmy/0Dnw0uXw79++KD28/t3ObgBVoZ6v3vamjcCE4cEsg0fP3xQPHPyRMn548fzpjU1Htk/b/7CpzdvhZ/buq11U3fP+cc3bnhNyMzZDwC4NFBQNIpjkQAAAABJRU5ErkJggg==",
  		url: "https://karagarga.in/browse.php?search={{IMDB_ID}}&search_type=imdb",
  		noResultsMatcher: "No torrents found",
  		noAccessMatcher: "If you want the love, you have to",
  		category: "priv_tracker"
  	},
  	{
  		id: "ptp",
  		title: "PassThePopCorn",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAKlBMVEUAAABmaLyRZsFmhsv/fGZmtOZn0ohm2qn/tGaN33dm7db/62bz/Wj////bpCx5AAAAIElEQVQI12NggAHeC3fBCMGAA5buA9OqWA0VKGUQYRcA/CAm7dSmUyEAAAAASUVORK5CYII=",
  		url: "https://tls.passthepopcorn.me/torrents.php?searchstr=tt{{IMDB_ID}}",
  		noResultsMatcher: "Your search did not match anything",
  		noAccessMatcher: "id=\"loginform\"",
  		category: "priv_tracker"
  	},
  	{
  		id: "cinemageddon",
  		title: "Cinemageddon",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEULCgQWFREgFAAjGwouHQEkJCI7Kg4rLSpDKwBEMzI2NzRYPA5hPgBYSSt0SQBvTxeJVgJwXDisawCmbxe9dgDWhwC2klbokADKmkP4nQD+nQD8qBPms1j8sTP9vVH7xWnOdrycAAAAn0lEQVQY0y3PURKDIAwE0IUSsWgtVakGhN7/liVgPhh4w8xm8Xupp4zSa5RBruKcszA3xC4Es9/QhTD4wB1EQMC47Nwh5guYJugqoUF665DLZczip/7jMYfI5YQGGhQ914h0QpGtwEcyRiI2WOfAYV1GifAeQ10Ivr6gIMdSPsrKhSwpvW2ZU/kCZFuT8UiSX8XJEOajNUkFrTvBc4PIf5tsD6xZsZ4aAAAAAElFTkSuQmCC",
  		url: "http://cinemageddon.net/browse.php?search=tt{{IMDB_ID}}&proj=0",
  		noResultsMatcher: "Nothing found!",
  		noAccessMatcher: "Forgotten your password?",
  		category: "priv_tracker"
  	},
  	{
  		id: "1337x",
  		title: "1337x",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB20lEQVQ4y2NgGDTgSYRG8Ks0ywsv063PP0+3vvIoSqcYJvcoWs/xVaHHiVclPhdelfndeBar34JhwAN/OaUnUTqXnyeb/X+WYvH/aYLxvcehqtL3g1WYnqVYrn5d7PX/danv/1eF7n8fhqgGYHXF/QB5jxfxhj9eAA15kWr5/3GEZu6DUDW7FzlO318VeYINeJpi3vAwTJ0JqwGPAuQZn0ZoLnuWYPz/aZIpyBWPniaZXXyR6/z/VbH3/2fZjlceRmhK4g2LhwFyuk+idd8+ARryIs36//NM+/8vC9z/A13x+4G/bCJRAfowWLnjebL5/xfpNv9f5jr9B4XLAzfhIzcsmFkIar7vLcUEdMHS56CAjDX4/yRA7v9DR+7/92xYb9y0ZBElbICHqOujALmfDz1E/j9w4Pr/wJb9/yMnHrAhQH4jXs13bTnYHzpy7bxvx/7/ARDfs2M/f8+OYytIM9SAR7dt2JRxGnDHhi0IqOgvyOb79pz/b1uzxt6xZjW8Z8/55QGQ/wBoCNCAzlvWrMwYmm9aMqvcsWW/DtMMtPn6LSsWUaAGpju2HGtB4kCx/3ftOP4BDfbHavt9B67zQM0gfAXIL0B4jd0HqPkMkD4P9Mp1oKH1gycTAgCB9OyFFDyI8gAAAABJRU5ErkJggg==",
  		url: "https://1337x.to/search/{{IMDB_TITLE}}+{{IMDB_YEAR}}/1/",
  		noResultsMatcher: "No results were returned.",
  		category: "pub_tracker"
  	},
  	{
  		id: "torlock",
  		title: "Torlock",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAzUExURUxpcQB8of9GAAB9o/9HAP9HAP9GAAB8oAB9ogB8oP9GAP9HAP9HAAB8oAB8oP9HAP9GADGxyYEAAAARdFJOUwBoF1Q5nnCWGjhQgSOCpJVct0oE2AAAAG5JREFUGNONjzsSAyEMxQTY2Oa79z/tFqTIMCmi8jXSg39IcQ12Db6SA2SRDJBsTgsQ7V0fKOYQy7MK5N1YAZDKUwFEWQ5QUm0AQz+KWVoFaJuwgGKedwNRgTCz6TC66pYT4ieo9qv4iL4Y49fTF16sAspZZx79AAAAAElFTkSuQmCC",
  		url: "https://www.torlock.com/all/torrents/{{IMDB_TITLE}}.html",
  		noResultsMatcher: "Error: Not Found",
  		category: "pub_tracker"
  	},
  	{
  		id: "yts",
  		title: "YTS",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUgHiEbICIeIB0dKh8bMxwaQRwWUxgTYBYRbRINdA8Chw4BmgkJpgAAtgAAvwAAygD2IFtIAAAAm0lEQVQI1wGQAG//ACAEMQIiASIiACBlIRAhABACABaAEREAIhEQADoxIqtxi6IiAHkiELy03WEBALcCEG7d2SAQANYQIi3uwgEiANYgEivuQAIQANchACr7IgACAMoiICz3ECEBAJ1AIh/UIgIDAD2wIl+yABA2ABfaEDVBACSkAAGetQEiIntgAAIX38qZrMYgACACKM7ttxASm8omLNhBbCUAAAAASUVORK5CYII=",
  		url: "https://yts.mx/browse-movies/tt{{IMDB_ID}}",
  		noResultsMatcher: "<b>0</b>",
  		category: "pub_tracker"
  	},
  	{
  		id: "watchsomuch",
  		title: "WatchSoMuch",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC2klEQVQ4jY2TXUhTARTH7158EV+EEH0RJXtQhGbqcLebpqQY6mZTmwiaH/MjQ+8Slsyvq3C3Od2mNucUvyY25tUMCpKJaJhojYURpkKJPYjswVgIlg7y34NM/JjQD87T4fwP53/OITiO8SNJMoC4AACey9Xh73J1+F/MnSMnI70wTyw25GSkF3Ic43cS1sQfzm7T4UaN/XCjxu5ea2s92tJEA+CdbQCAR2SlJjNZKUmuxPgYrcvV4a9RqdhGpXJP1dYM51wnFl4b0N3Rgolx0/b72YFsjmP8RKLiSHFmpoSiKJIAwHtWllI92kI95zhrol6n+ymnachpGuZeE+Q0jfIyGQw6Pd5MWNYHjMyNxPgYrSA2bjchlj9IEARBHCxJQzyracNOe/ukdWwUGrUaGrUaBp0ecppGg6IO5l4TzL0mlBdJqvPSoowJsfxBIZ8fejqPZzVt2O3I9TjnOvH25QjG+1j0saXoM6hh7jXBOjYKW3cF7No4m10bZ2NZZfA5M3c+VlVuLcrgduR6Zs25eGdMhrP/Fj7bxJgfq8KKRYxNWxLmdaT7g/FOyaVt7G9ohLPTjGdrUYbGsnhIbkdAcjsCFdlRmFTHYucVH4MqCUbbC9YOlqQhPgW+Ldf/mnrRitlpxmPrrkBPwwOMtKdi2XoPw/p89LGl+DKVP3R2naccbWmif69X7XUZ1ahWjYDWWlDZZkKRsgv5texxk+IRNm1J2J55WO/zoL4v6K9vLNTtGIYGQGstoLUWVKtGIFX0QKroQSf7BCsWMeYtssvzEwRBsKwymDEMf/IWljSfdPcKFMpZyJ4ybkWr7u5VV000tveLK5S6r/m17LE3JFVtEJU2HueWN+0WPG6u4zjG70oBADyWVQbfl5TLbwrT96P41N/o+NQ/wuQ8jUhUHOnTPF8kUZQ0LCzcERh4bSYsLNxBURT5X4VeBAJBkEAgCCJJMkDI54f6encv/wAZNJAUcgy6PQAAAABJRU5ErkJggg==",
  		url: "https://watchsomuchproxy.com/Movie/{{IMDB_ID}}/{{IMDB_TITLE}}-{{IMDB_YEAR}}",
  		category: "pub_tracker"
  	},
  	{
  		id: "torrentdownloads",
  		title: "Torrent Downloads",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAMF0LNmMIP2wbSXcpU4IqXow8ZpAAf8MRhckAis4okM4lmd40l9YtoN48nNxDoeE2peRKpudMq+RaquZVsuxjsu5muO1tu/d2v+9ywPx8xvaKzPeW0vil1/+u2/2x3/88iP8IAAAAZUlEQVQY02WPOwqFAAwER8kDSxE/eP/TqWAtKLsW+pTgkmaHISTFSE6oSn0r+RhOXYGZABheo2diwLchA8YL0IFK+Z/Ws62wAKNrcCgDfQECmgdw7QDMSi1cVL906f4Ydxwc+bkTQKZNE4WywAAAAAAASUVORK5CYII=",
  		url: "https://www.torrentdownloads.me/search/?search={{IMDB_TITLE}}+{{IMDB_YEAR}}",
  		noResultsMatcher: "total <span class=\"num\">0</span> torrents found",
  		category: "pub_tracker"
  	},
  	{
  		id: "limetorrents",
  		title: "LimeTorrents.info",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAByFBMVEUAAAA5tyEtshlZxU245a7Q7sHY8M/T7sXM7L7B6K6655bW7tE2zD2u46nB6Kiu4aY3zTuz4oSS1os+zzp0yVR30GtAwy1vzGA9uCNWwEkzrR4hixcpohtDriAhfxEWeA8AAAAAAAAAAAAAAAApjxckfxEWdQ4AAAAAAAAAAAAAAAAIJgUmiRUgfBAWdQ4AAAAAAAAAAAAAAAAAAAADEAIVXwwddw8fexAfeg8abw4TXAsTcQ0AAAAAAAAAAAAAAAAAAAAAAwAABgAAAAAAAAAAAADU7czr9sX6/MDx+Mj2+8Pw+Mvt+LS147O64bza77f0+Zff8W6Vz4CSzZjF5nDx+GR60nCUz511xE6y3ijX7TWY0i6Jy0yU0D7P6ia94yhezjRhw1pNtEmJzizj8gTv9wPL6EHz+QXK5y/L6BiDzxdpzS1z0jFoyVN1yVl6yiCJzxR9yE55xxxtwxlHsT1iwFNbwCZ70S1+0y5oyy9yzFdoxV5QuE5WuF9FslBXvFtWtkpowSd1ySp5zSt7zyx2zCtlwypWuCdJqiE6lRlKqh9dsyJjtyRktyRhtSNarSFMoBw5jxY7mRlEnBpFmxpCmBk5kBYthhMUXplsAAAARnRSTlMACQQhoun8+dufSgIS5tRAZvxsmfw+qaecpXFiJ/3sDQILFyO//lwMGSc3Web5bAMRJjpNedz6/f73yCoOIDtffIp8URYBgBh7bgAAAAd0SU1FB+QHBRYaBGsUPhYAAAB8SURBVBhXY2RAA4y4BBgZ/yEJMDNCwVeIAA+jJYR/iPEjWEDAFqZiD+M7kICwM0yAcSsjSEDMCy7AuBYkIBGMEFgCEpCKQQjMBgnIMKbA+FMZGRVAdBqUP4XxFqM6mAURmcZ4iYFRHyoJBkfBLtXnhfH3wPwCBK63H0AYAJMkE5AqT9tgAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA3LTA1VDIyOjI1OjQ5KzAwOjAwEl545QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNy0wNVQyMjoyNTo0OSswMDowMGMDwFkAAAAASUVORK5CYII=",
  		url: "https://www.limetorrents.info/search/movies/{{IMDB_TITLE}}/",
  		noResultsMatcher: [
  			"EL_COUNT",
  			"table.table2 tr",
  			"GT",
  			1
  		],
  		category: "pub_tracker"
  	},
  	{
  		id: "cinematik",
  		title: "Cinematik",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABO0lEQVQ4y42TIZKDQBBFuQAKyQFQHACDxiIRHACDwyKpQm48kioOgMQiuQAn2FyCSV7vNjtAKtmp+kWm8/tNdw84znMNw2CKohDleb7/tmXHsywzbdsaR1dd1xLA9Ny+FR7L+wdI09REUfQRgCdJEqniAOj73pRl+RGAp+u6KwBqGIa70XXdtxVcWvi63WRAmOI4NuM4isnzvP/NgACJatq2TTRNk+x935eq9PQDoGkag6gAE08FqKgQCInqvQD0pDNgWRaJBUEgnqqqrgBtg0EyaRLXdRUwrRFHCvi9sZ/FUCiRIFPmiux3A5HMk5MBoAOAZOgMiRPPAgYYH1VxSzuA03k5oGICQoKKPRXR1vf9bvh2HHtRgfYF4CwgeEg+nGxXAFVbUdGvPvG8TGbxB8kqvVYVsXmeXyY/ABDjxk+V4DOKAAAAAElFTkSuQmCC",
  		url: "https://cinematik.net/browse.php?cat=0&incldead=1&sort=1&type=asc&srchdtls=1&search=tt{{IMDB_ID}}",
  		noResultsMatcher: "Nothing found!",
  		noAccessMatcher: "Not logged in!",
  		category: "priv_tracker"
  	},
  	{
  		id: "kinozal",
  		title: "Kinozal",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB+0lEQVQ4T2Owdm/wAeL/UOzDAARoYrjEwWIgwf8nzl/6/+HN/f9TF+767x/R8b+gdvH/Gzdv/P/49tb/q9dv/J+9dM9/r5C2/809K/9/fHEOKHcRbAjcAJDmn28v/v/9DoL/vj+Hhs////H2wv/vby78f/v23v8Pz8+hGOAzY9Hu/7+AGqdyc6BgmAF30vz+r5IV+X/IRvf/t9cX/meWL0R4AeYKkAtur5j4f4WMCFgziA3SfKMg5v98Yb7/02Uk/q/xdAAbALcd5gIH7yawM0EaYAaA2DeX9v0/YKL8/9LUBhQvxab0IVwAcs6kebvgkkskBcEG3Ih1/j+Tj/P/SgdzjDCZMGcX2Btw54NCGt2ATgaG/6fbSzA0g/Chk6iB+P/Vk8twSZgXVkgBaQnR/7frMzAMeHgXyQCQU548vAqXnAcMMJABT9rS/x91NgC75Iin2f9PNxDePHzqHIoXfKpbl2MYAGL/vLfr/0YtebAhR2O8/v95ewYsXtmyDDMaQRKvljWCDQBhEBsk9mJW1f+5AjxgQ457QAIUIxpLG5aCJbAlpF8P9/0/3Zj/f1OIB9iQc/3VqAkJHIiPMUMaH75yFS0WumbsABtSWLfkv41HI5g+AgwokBgoykAuBKkrqFn8/+q1c//XbNqPmhdAHCiGZ1uoM1Gci00tANqbcjckBbSEAAAAAElFTkSuQmCC",
  		url: "http://kinozal.tv/browse.php?s={{IMDB_TITLE}}",
  		noResultsMatcher: "Нет активных раздач, приносим извинения.",
  		category: "pub_tracker"
  	},
  	{
  		id: "hdspain",
  		title: "HDSpain",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUQEyQWHi0mKzgRQnU6P0wsTHxLTFUxWYhTXWk9Z5Fga3dRcphvd4Fhe5t/hIdwiamCi5d/lrKHmbGWnqmUpburrLGbr8ertsS2vse/x9DL09rT2+Le5Ojl5+Tr8fP4/PwJwkjrAAAArUlEQVQY012KWXLEIAxEW8Q7ZmQWDxbywP1vGTL+y+uqrlctoclZWj0fpDbUAbEWwsOkKAaXnjDx9Yo7YcNFdJUDkxBJ2TEhAsb0S4QRObCgjzFOOPpTzgZ/0/Z+d9lgFoMlYcCeAlFYiMywpYQQvPe9wle8B3Mo9b4/PRqYGc7ph90X1V6wNjdxNojzKtZarOvKpdpcJXP3FfPsHDfWND9gHK/7zrO68QE///gFOwENOGpGQOcAAAAASUVORK5CYII=",
  		url: "https://www.hd-spain.com/browse.php?{{IMDB_TITLE}}",
  		noAccessMatcher: "Olvidaste tu contrase&ntilde;a?",
  		category: "priv_tracker"
  	},
  	{
  		id: "bithdtv",
  		title: "BitHDTV",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAM1BMVEVAAADycADyegDygyv1jAD2lgLxmjP2oQD3rQDyszT4vQHyvVr5yAb40EX71iP92gD58XfXuXcpAAAAAXRSTlMAQObYZgAAAGFJREFUGNNlT1sOwCAMUldtxUd3/9NuZrqtkS9KCFDnPtTuDCJL/d8UiKUZ4UaylhBNBudJBHqODllO4qq9q65SH0iAUqBTODwxBsG7Kz1pDehmKzjaZUy0LfPBvpeT23EBWkoCeXAFA5cAAAAASUVORK5CYII=",
  		url: "https://www.bit-hdtv.com/torrents.php?search={{IMDB_TITLE}}",
  		noResultsMatcher: "No match!",
  		noAccessMatcher: "Forgot password",
  		category: "priv_tracker"
  	},
  	{
  		id: "awesomehd",
  		title: "Awesome-HD",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC+0lEQVQ4y3VTSUtbURh9O9G/IA6rKo41YKvdtMVaEEQF0Y1V3ChOtTgkNhqTZqhDNEb05anRiHUeSZMoaSgajaIb3YlvIVY3IroRHGJ4Ek7vvaWCghcO3OE73/nOd+/luCfj+PhYtry8LExMTIhjY2MBCjp3uVzC0dGRjHtu3N3dhS4uLg4YjUaJELC6ugqn0wmHw8Hmk5OT6OzslGZmZgb8fn/oIzLZCLNard6uri5Q8ubmJmZnZzE9Pf2Ara0tTE1Nobu7GzzPe29vb8MeEtjtdoEcBEm5WF9fx8rKCmw2G5tvb29jZGQExBY2NjYwPj4Ok8kUJAICI5+cnMja2tqkoaEhuN1upi4IAogd3N/fQ5IkZsNisbAEHo8HpFoYDAbp8PBQRtV5s9mMhYUF7OzssMDBwUFcXl7i7OwMp6enuLq6wvDwMPr7+1nM0tISent7MTc3x3OELFICbRQNon3Y39/HxcUF+vr6aLk4Pz+HKIrMP41dW1tjVZCmilxFRUWgo6ODNUqtVmN+fp7Z8Hq9bI82lRJ8Ph+zpdFo/t8IysvLA1x2dnagrKyMKdE+UOj1eqhUKmi1WoaWlhbodDqmTs97enooGVlZWQGuoKBAzM/PR21tLVFfQF1dHUpLS1FZVQXeIhDFbxiyDsM2OorpmVn8ILdQXVODnJwcEHGRUygUfFJSEs0Gt+c3iouLUVxSgoaGRvx0ulhwi6oVcrkCCkUT7A4nioo+ISYmBvX19Ty3t7eXEh0dLcXFxWHQOoLcvDx0mczotwzAahtFk7KZITU1FVRI970dHzI/Ijw8XNrd3f33tOVyOR8fHx/UGNqRmJiI2NhYvH33Hs1qLYpKSvFVpUFFdS0qP3+BRt+OtPT0ILEqPLzEm5ubkMLCwl+vXqcxMi2PJARdv0xJIYQ3D0hKTib+c73X19dhT/9DiFKpNEZFRfkjIiIQGRn5CHSPwN8ol/eSfxD67K88ODh4Qd6DLiMjw5eQkPCHIjMz09fa2qqnZ0/j/wLh8zZcSejfaQAAAABJRU5ErkJggg==",
  		url: "https://awesome-hd.me/torrents.php?id=tt{{IMDB_ID}}",
  		noResultsMatcher: "Your search did not match anything",
  		noAccessMatcher: "Keep me logged in.",
  		category: "priv_tracker"
  	},
  	{
  		id: "avistaz",
  		title: "AvistaZ",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACZklEQVQ4EQXBT2iWdRwA8M/v9zzv63Kka75m6qyIoWV/DMQayBoUwQ6KuEqEPNjNSweriwQZgVKXoDp48rDIRLIgOtQ6hDbIMQmhQWC0/ogVLTfm7A/v9jzPt88HAAAAAKBAGwAFQAaA6c1FCwAAsB1jOIX3MYwEGQAWqnrkz03l5MLGMpY2ljF3V9kcWJ2/xXc4i6dwBYPYDAng2vber7c89NhwNXOxauSiXUqX/4m4I2t6y1SM/dK8frnb3F6HTdiDRVwE14ZaF+p993Wrpwdi5XERu4t4494ca1sCsa4lnuvkQDcxj9ewDWX+YiQ/uWWDkWh328WOB/3aV2ju5FgnWxwoTWwr3NNJ3t6ZjG5K7eDNnJzBVVR550B6aWVtUzW9C+bmLmk6yfJ0MnsF1xmfDc8uJReEv2sRR4qbTZgFyGV/DOmPolj7n5nuksFVnPwt7KorgjOyY93sp2lOjKT6eor9AJCjX591RcqPDkuPPKOaq+wuuIWH69o8JI4vN54YklodGwAgW+P3ld46Xj03afXix453k9G6BlcjdKrK3ro2sT/7lyat8SMA5G5vfNXTSSuH9qx34PxWp6ayE3sTyPhQ4Zt2uLGBnv5o3ejx6Q/v5RaAFw+mzvInRcTEjojJ3RETYn2/yEkg3jmcQin++iDVi+dSAADkd8+an1kojuopuG2VvjGWbtEE7RYzf4Sj+zRffi+fnnL/zx+lEgAAXBoffOHmZ6uDXGEFVauw/NZhcfqVFHhgajyVAAAAYmZXCXgZn+/YaroonD846hBsvTuVAAAAAE4ekdACgOdHtQAAAOB/xuPqOv7xO8oAAAAASUVORK5CYII=",
  		url: "https://avistaz.to/movies?search=&imdb=tt{{IMDB_ID}}",
  		noResultsMatcher: "No torrents found!",
  		noAccessMatcher: "Forgot Your Password?",
  		category: "priv_tracker"
  	},
  	{
  		id: "avistaztv",
  		title: "AvistaZTV",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACZklEQVQ4EQXBT2iWdRwA8M/v9zzv63Kka75m6qyIoWV/DMQayBoUwQ6KuEqEPNjNSweriwQZgVKXoDp48rDIRLIgOtQ6hDbIMQmhQWC0/ogVLTfm7A/v9jzPt88HAAAAAKBAGwAFQAaA6c1FCwAAsB1jOIX3MYwEGQAWqnrkz03l5MLGMpY2ljF3V9kcWJ2/xXc4i6dwBYPYDAng2vber7c89NhwNXOxauSiXUqX/4m4I2t6y1SM/dK8frnb3F6HTdiDRVwE14ZaF+p993Wrpwdi5XERu4t4494ca1sCsa4lnuvkQDcxj9ewDWX+YiQ/uWWDkWh328WOB/3aV2ju5FgnWxwoTWwr3NNJ3t6ZjG5K7eDNnJzBVVR550B6aWVtUzW9C+bmLmk6yfJ0MnsF1xmfDc8uJReEv2sRR4qbTZgFyGV/DOmPolj7n5nuksFVnPwt7KorgjOyY93sp2lOjKT6eor9AJCjX591RcqPDkuPPKOaq+wuuIWH69o8JI4vN54YklodGwAgW+P3ld46Xj03afXix453k9G6BlcjdKrK3ro2sT/7lyat8SMA5G5vfNXTSSuH9qx34PxWp6ayE3sTyPhQ4Zt2uLGBnv5o3ejx6Q/v5RaAFw+mzvInRcTEjojJ3RETYn2/yEkg3jmcQin++iDVi+dSAADkd8+an1kojuopuG2VvjGWbtEE7RYzf4Sj+zRffi+fnnL/zx+lEgAAXBoffOHmZ6uDXGEFVauw/NZhcfqVFHhgajyVAAAAYmZXCXgZn+/YaroonD846hBsvTuVAAAAAE4ekdACgOdHtQAAAOB/xuPqOv7xO8oAAAAASUVORK5CYII=",
  		url: "https://avistaz.to/tv-shows?search=&imdb=tt{{IMDB_ID}}",
  		noResultsMatcher: "No torrents found!",
  		noAccessMatcher: "Forgot Your Password?",
  		category: "priv_tracker"
  	},
  	{
  		id: "baconbits",
  		title: "baconBits",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAElBMVEVjb2yAAAD/AAD/gIDAwMD/yMiKKu/5AAAAAXRSTlMAQObYZgAAAGZJREFUCFs9jdEJwCAQQ0/oAD1rBzDgAOXw34ILVLn9V2mg0nyERy5cRH4F3T+IyHSVAICeJRYf0EiYVhk+cpqZo1xyVJ/mkzBQGPLEgltlOWuED0LqN8Mk2mRTZDr/d01ruLcF1Av9ug6Qi8e/mQAAAABJRU5ErkJggg==",
  		url: "https://baconbits.org/torrents.php?action=basic&searchstr={{IMDB_TITLE}}+{{IMDB_YEAR}}",
  		noResultsMatcher: "Your search was way too l33t",
  		noAccessMatcher: "You will be banned for 6 hours after your login attempts run out",
  		category: "priv_tracker"
  	},
  	{
  		id: "bluebirdhd",
  		title: "BlueBird",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAACH0lEQVQoz4VSS2tTYRD9HnNfubm9murGR21MGhXtyo0UtBtFcJG9GFy4EfwrunIlggtXii5cCILioqgo6sKmVqloTNPQkJA2N2nv+/U5SSkoaJzlfGfOd86ZoQ+fPb/7tRHopkgT8u+ijIHnVo5Mwu33y9kr13maEiEIGTsiSfefPgA7immzkfg+oWPxgjBFEWkKycDaqn8ncUzpHxNJiiV2evjEKOOyzDe7EFo9Y6PjOE4Ux2T3FyGEriqGqqBMRIdRNLAdwXl2owtaEl0oFT5UF6v1mgywg0Y31yqXj+WnXT9wXK9r9Zvt9ttq1e12gAUeUBb2NnsrX0CRUStK4cD3G9nI918vLKA2RVEPHDx0bvbUy5XPEDqOAvxEsagzoqoqx/gABv3+REZbb67du3WTyMgiLpbL85fK+7JZQMI4ikonZ8/MzRl6Jqtl9pjG2uqqbdt9y0KB6FsEQaNWQ7UgIZumCcbevXm1tPhJQjJCGKOu46IS/C1XLKFp4Pz02XnP94MkAckwwji2grDlR3I6imiYJr9xtXL08NSWg7OuF4aC8m/1n70gghCUDnb0idzMcWQarWi48m2Q256/7fleEEZx0hn0ltY7cm4SIi3zceCm+oRZMH/f64t6i5IWHRVSJEmqTuVlEYNk5jLThTQI/n4Pu4c09KYoxLbQs2rkZzCp/x0fDqjuj2V659GTx1aYmHsx37Fwxlz3PHV+Ac6QFHoZo1YgAAAAAElFTkSuQmCC",
  		url: "https://bluebird-hd.org/browse.php?search=&incldead=0&cat=0&dsearch={{IMDB_TITLE}}%&stype=or",
  		noResultsMatcher: "Nothing found",
  		noAccessMatcher: "К сожалению страница, которую вы пытаетесь посмотреть",
  		category: "priv_tracker"
  	},
  	{
  		id: "broadcasthenet",
  		title: "BroadcasTheNet",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACw0lEQVQ4y42SX0hTURzHr3fbPef8pkG99CAhRIKlIhHVU0Qv9RS9+hSEkAslt5lO29KphTolHW62f243nRNk2rQI0iQrTA1LQ5x/VloR/XmxByEszdO5ZyqtMDrw5Rx+v8/3d3/3/I4g/GNheeE4DkRPCv+7SEdMldL5Wo39UQn7pveBPLtO5DmK/LPpKDAnJbfPqSH4RrVjAU3H21RNcPEY9rxCxDOZAZ7JDbZT5JnKVLsnJCm0dEQdXEr7y6gNRDWSHEuH9tgX6IhRJMdOkJbRTLCPULA/o7hlLAfJ80dZ7gfTsiawkL2rc1ad2H5g5oPWP/MT/DOrrP3DpHEoE2yDFGwPKW58lCN5pg+w3FfGrEEguiLUjUvbZuR6UQveKQpe1q5rwsgLVkUyoDpCFaGaviwiCEmSd/Kcwigscr/0xt25FSK0Po8xrRPH+CI3W8OIXA1mgDlEFSFzVxa29mI+Gcf4Y8ZSpndC3WMsoOv3U6H5yQrYn1Jyc7iMQ6UBhK/4DkJJ2zqU+CkqactWYjzXMKRTWOZZRfWD+4Xkiu50qH+wBrYBCjfuFfJpGLyioHOo0GVnGBU574oFXiTp3Xx8YO3N42z9ACXVfYcEXNmzmxk/M7FAxMV/oaY/ace3UnXHorBMy6g6sleIV+0ZY1ojleFvgs5Ott/FpaYkdYE9oRhj3issWMPzwqk8MT6F8uBZsHRRpg1sDvXzt2EOqUmxR0MMLo22opvPHJlDrk2OIksoL16xTOZfQCa5G0wyVcQubAIXe85goysNG26lIaPrNIuNbOWR6fYw91o6492R0oAoXPCJ2OgdgGIvZdrgu9HznWn19xgrPCoUOBGY/GLC5SSb2ngAFTmugd75EfStFAybYmeid35iE6lVmJTyP8xba4/JzVsS85sBFTozSX5DLly0nWfnLJWuScuZMl/Cpf4Cmc0+ISdaHKUAAAAASUVORK5CYII=",
  		url: "https://broadcasthe.net/torrents.php?imdb=tt{{IMDB_ID}}",
  		noResultsMatcher: "Error 404",
  		noAccessMatcher: "Lost your password?",
  		category: "priv_tracker"
  	},
  	{
  		id: "cartoonchaos",
  		title: "Cartoon Chaos",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADIElEQVQ4y22Rz28UZQBA38w37m63u7QW0i0tBVsKsZY2tdYbkJgGvECEKAeTnoxHTTxw0INRjEfCH2CDmpiYEEKNjSbQNvyK2BY4tJRgW+0PdwXHLTs7Mzs7s7vzzTceNB4M7w94ecnTkleuxPVLlyCXg+5uuH4dFhZiTp3SmJ2tUSh8BHwH/Ak0+B+6LBbBtqGnBzY22FkuI1xX6o8fx4O9vSmh68eBDkDjGehsb8OOHWBZvNfWxsLEBLmREUNNT2vDXV2053KHgL1A5lkCQ2gaUaVC59wc71+4wL6eHtIDAxq9vdy8e5cQdgNHgEUgAPR/i7KAbqRyORpLSzwxTY6dPMknZ8+improGx9HO3OGRKFgyMnJd5XvnyCViuJsNqt1dLSmhdCbLAut++rV2L58mcrFiwC0HTjA7nPnSLS3oykFQhApRagUDSFISEmf47BncxNrbQ0jHUU8d/o06Y4O5NYW6f37EUKgK4VSChXHNISBHtY5uL5On2mStG3MYpGVR48wkpqGoeskjx5FDQ3hTE0RdXaR6NpD6Ac4Ty1q+Tz9v66S81y2lcJyHNY3Ntja2sJICkFsGDj37+M9fMjzY2OEu3LYP/xINr/Ka5mAY70JzFbJxJ3f8asutl3Cq3j/XEjoOpGUtA4Pk3xlFOfnOUbnp3hnsJnDr79ASy6L1ixQrkOpZHL+mzwyiv/bqB2ZmYmlrmO5VYzvv+XzIXjj+ABaSxP4NQhrENUgDiD2WV4ucG3+D4rlOj89KKMdnp2Ny36dzOSXfHWijf7RPghDfLdKSkTohBAFID2IPIgboGJipZi6s40RCAN7/gafDUr6X90L0ufBcp7p22t88PYhdBGC9IlDD9+vYXsSL4iIVIxSMUZFxSizwOBoBqout+c2Of/1PUZeasPIBOC4RI0ajteg5ErcqqRak4DGrUULvSpDTFLMLeYhcDDNIl98+DIrvxWZubYCqkaxXOfJ0zqmVeevch3bk9z7xcELIgRvvflpHUFw4ybjY7sYeLGZTCrkYGeKjydW0dHY2ZKgaDcoOSGVaoRTldxasujfl+FvqCOMJcJKv+YAAAAASUVORK5CYII=",
  		url: "http://www.cartoonchaos.org/index.php?page=torrents&search={{IMDB_TITLE}}&category=0&options=0&active=0",
  		noResultsMatcher: ">Av.</td>",
  		noAccessMatcher: "not authorized to view the Torrents",
  		category: "priv_tracker"
  	},
  	{
  		id: "classix",
  		title: "Classix-Unlimited",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAY1BMVEVwAAA5OjhLTEpTVFJdX1xmZ2VqbGlub21zdXJ5e3h+f32Bg4CNj4yVl5SdnpuipKGoqqesrquws6+2uLW6vLnAwr/ExsPJy8fN0MzT1dLY2tfc3tvf4d7k5uPp6+j09vL+//yIRtfFAAAAAXRSTlMAQObYZgAAAJRJREFUGBkFwdFOAkEQBdHq2XZ1E8AY/v8P9c2AwMwtzykuKwAAsP3W55cAAEDd2zyqAADsvfe4lwBQr9Ad/VkFsM4f0tsKSGCAqR4zXsn3PF9Sf0Uvc6txQK1b5Y1+jh2mysy7lfFQVVA0jBeJKpjE9FQIqip2KThO83iish0lrLV1ng7LpqS2taAGYHEaMABQuP8DJBFvD9yJvdcAAAAASUVORK5CYII=",
  		url: "http://classix-unlimited.co.uk/torrents-search.php?search={{IMDB_TITLE}}",
  		noResultsMatcher: "Nothing Found",
  		noAccessMatcher: "Recover Account",
  		category: "priv_tracker"
  	},
  	{
  		id: "dvdseed",
  		title: "Dvdseed",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAwFBMVEUICQsBEyEAEy4SFxojFwYeICQRKUw0KBQDMGImKy4QMVAYMksgMUENNl0GQHdOOBpaOQ1APj0QSYo7Q0k0R1xYSjADWKtLTk4ZVqMYW50QXa8GYa0kW5EAYroPYL1yUyFbWFaQVQSJVhZVZG8qa7IybKAzb540bqmoYwOLbSymbRbCbQa9cg9/gH+ufyi/fCFsjKeLjI7PiBzOkSqCm7B0pNCaoaeko6GatcymucXBwsDO1dzU1tPc4uvl5+T4+/ntVDcqAAAA30lEQVQYVwXBXU7CQBSA0e/eGWTaUhDRKGrUJ+KTW3D/O9AEjREJqFEBS7FlfjxH7v1zHwAiur22lpjPU5KEaKdLozZ+zbMJAPXUu+WZ/q3iwBhjnDu63dKujFdf2Ne3tTsQXWR2p65152Wm1QZ+I76rqS47cV3Zkfhp0XXYoCU6aTP/sNk1bd6zUfOYbGe9HF9C/VTI+NsrsL/jMeD6xtrjvarXD9kHjyBylYQEn6cjCC/x0PREgCCb9+onG84LPSElAnUTqqoBsaVd7IH2Jk+E2ejCqu1FYDgzwCDL/gEF+GJOs+pBYwAAAABJRU5ErkJggg==",
  		url: "http://www.dvdseed.eu/browse2.php?search={{IMDB_ID}}&wheresearch=2&incldead=1&polish=0&nuke=0&rodzaj=0",
  		noResultsMatcher: "Nic tutaj nie ma!",
  		noAccessMatcher: "Nie zalogowany!",
  		category: "priv_tracker"
  	},
  	{
  		id: "ethor",
  		title: "Thor's Land",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAEsAA4kJBmsAHW8AGpACG8MAIMEJJY0AKcMSNX4ANcMxM5MDPMQfN6gxNokAQMMAQ8ExVaJRWJc9XcNwls11l9+JncGNstS5tdPFzNKu0PPg3vPL7v/f7/b/+vj4/vzNbpFdAAAAoklEQVQY002PSXKDQBAEGwEzTWusLAm8CAH9/1/6QHi5ZmRUZBkAETgQAgNA7kPQ1H5A8f69l4tfo9tzqSoCI1SQMnPwIjD52Hy855EdpyHV+2IfebssUxFGa295fFnadmQdZeBz7tvlNeQzPWSojHHZbO2f3dXPDZXr9lgfa9dcmByY5v41zVVFGPJC1GW/FTi/SBQfP6vgL53w4B8gglPgG7AKDn2eFB1cAAAAAElFTkSuQmCC",
  		url: "https://ethor.net/browse.php?stype=b&c23=1&c20=1&c42=1&c5=1&c19=1&c25=1&c6=1&c37=1&c43=1&c7=1&c9=1&advcat=0&incldead=0&includedesc=1&search={{IMDB_ID}}",
  		noResultsMatcher: "Try again with a refined search string",
  		noAccessMatcher: "Vous avez perdu votre mot de passe",
  		category: "priv_tracker"
  	},
  	{
  		id: "hdme",
  		title: "HDME.eu",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEVlZmRsbmttb2x0dnN3eXZ8fnuChIGFh4SIioeMjYqXmZadn5ygop+mqKWpq6isrquusK2ztbLAwr/IysfR09DU1tPY2tbb3drf4d7m6OXq7Onu8O3y9PD09/P4+vf6/PlaMftZAAAAmElEQVQYGQXB207CQAAFwOnu0pZKQoyS6P//my88gVxKhR5nugkA0BweGd2apzqkOzY5GRz3TttH+RgUKwl8fjlHI48jIWU6RxG17yFZuyiSutsRma9v0cT6rJ78GMYo9H+/3m+vb9WdJqn3/VzFdicKarfMQ1guM0UYL628AlFk2fTL6BWbqY8GzSbienXQTRMAuHUTAOAfG8lKXWGZLRIAAAAASUVORK5CYII=",
  		url: "https://hdme.eu/browse.php?blah=2&cat=0&incldead=1&search={{IMDB_ID}}",
  		noResultsMatcher: "Try again with a refined search string",
  		noAccessMatcher: "Note: You need cookies enabled to log in.",
  		category: "priv_tracker"
  	},
  	{
  		id: "hdsky",
  		title: "HDSky",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACiklEQVQ4EQXBvYtdVRTG4d+71t7nnDs580HGJBMFRRKUmSBYKKiFWMTGUhsbQRDsBIO1f4VYaWEjgo1NIKUIWlipoBaKoIQoJnDz5Z177zl77+Xz6M3nzz/36vHhZ/uDTnYXWeCIGcIpdSa5E2HUVpjLzKLfiXUp3F9tf/n+r9UH+vzdZ3+1Nh1nJ8Yhy5SAmQgjopGTMc8CVbbTRN8NrDZrgsTDOf6x3cGeRgokBUElSJ6QCUkgw5IBwt2QGe5Oyl3sdHZkSGFmMgkkzAAFSGAiJafWhszAjKCRu54WVZJk5iKAlI0HU4AlULCpwekcrAss14X720oAQWO7PcVMyEWShAz2z3Rc+/R3PnzjMsfnMl/9sGS5ntnrE9d/usvukOg8eO/qERfGjoqwBiYz3I0ADseOkNhW6HJidydxpndeuDzyyTuXOLnYc/3nB6SuJyKQiSQJAWAM2fnoxk2Mxt1V4/UXDylzUAMOeufqyR4ff7MkJEICiSQJJMzF6Vx565XHePKRzI0f77HaVHoTAFODECQXKDAEZhhACExQa3A4OhfHzJiNFkaNRpD5bzPz7W8POXfQYSHchbuT5CK5UcrE2EOXnJQSi95pLobk3PrjHte++BMz4/3XHsccrIlKkISQxHoqvP3yPkd7PSXgpaf2KVHoPHPl0R1McHYUB+OC1ekWWUOIBECA5YFLF5zOnblsOTt2tCq63DHmILux3m6YS8VTIuaZkEiIMBcQ4JmGQKIBDagENUS0ICSIRoSQAYDdvLOZOjeQyGlABCYhCQQESCAAgTzRWmHoBv5drie/ffv0yhPnF88cjH3LKalG0FoBjFILIFpACyhlIqWBqVRu3Vnx5Xd/f/0/VkQNu5/steIAAAAASUVORK5CYII=",
  		url: "https://hdsky.me/torrents.php?incldead=1&search={{IMDB_ID}}&search_area=4&search_mode=0",
  		noResultsMatcher: "Nothing found!",
  		noAccessMatcher: [
  			"You need cookies enabled to log in or switch language.",
  			"你需要启用cookies才能登录或切换语言",
  			"你需要啟用cookies才能登錄或切換語言"
  		],
  		category: "priv_tracker"
  	},
  	{
  		id: "hdtorrents",
  		title: "HD-Torrents",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAQADBgEICgYOEA0SFBEVFxQdHxwlJiQpKigtLywxMzA1NzQ6Ozk9Pzw/QT9BQ0FGSEVNT0xQUk9VVlRZW1hfYV5jZWJoamdzdXJ4eneKjImRk5CXmZafoZ6rraq5u7jVZFBhAAAAAXRSTlMAQObYZgAAAH5JREFUGFdtztsOgjAQBFBmKJZehaqFgsr//6XSNiYE5/Hsbnaa5hQc8x8o9rSCFeTovLNaGX8p4PKu6ACfgYoz7tNzTXDMYLgwpohF6wIO2+sdHwiDLCeOK29xxKQqGCb4MMeIvny5ogUpv2NboA97D2PsUHuAXa76a3rICT6bhgVAlZPUGwAAAABJRU5ErkJggg==",
  		url: "http://hd-torrents.org/torrents.php?active=0&options=2&search={{IMDB_ID}}",
  		noResultsMatcher: "No torrents here",
  		noAccessMatcher: "not authorized to view this Torrents",
  		category: "priv_tracker"
  	},
  	{
  		id: "iptorrents",
  		title: "IPTorrents",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABTUlEQVQ4y6WTPUvDYBSF8zeKY3EqwZbYOrg0iWnSNfonimBBEJxKi6BgsikmcbO7ne1SB3VRoX5sdSzBrVTXWq7vuZBSNaCJgQP345yH902IJImnXFZXNU3fTiJkkJUsq1qqVKypaVYpiZBRVW1ZEs1e0nAkTVtzANhPC9B143gGcB2XHvp9XnTOO1xD3olHtr3xO6B91qbpZMKLKAxhBiDmr2HIvi8AwzBjAZHx5uqaXgYDhmAPSAQUX+NIkuWlhnijsSfA7H38xoFabZP33Ysu18jkcrIrZTILu9nsIvmez4ZicYXub+8oHA7pstejZrNFmqrzHPvAD6hQUAgZkT1ggBA5hw4bUOPY6FHPC/vTIJifJQM8Pz7ReDSi+lb9J8C212chGNB/B5TENeCJBaQUA3b+AWgAkBf6SBFGJs9/pCgUoZZQ8EfBqyD7CW99z7OYsUYmAAAAAElFTkSuQmCC",
  		url: "https://www.iptorrents.com/t?q=tt{{IMDB_ID}}",
  		noResultsMatcher: "Nothing found!",
  		noAccessMatcher: "Forgot your password",
  		category: "priv_tracker"
  	},
  	{
  		id: "mteam",
  		title: "M-Team",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIklEQVQ4y2Mw1RbZmBmm8YocbKghPJ+hMlnv17dT8f/JwWkh6s/BBnw9GfcPJEAqDTdgcLngy8m4/68ORIEUodgG4qOLYbjg9paQf0aawjv5uFlLEvxVH36Biu+f6/lPW1lgpYIUz+ylHQ6/cbqgMkX/qxAfGycDEHBzsgSeWOILFve0kTnEAAXKMrxzYC7BcMGkcovf4sIcWiCFIgLsFbc2h4DFg10ULgjwsrGAxPVUBdfjdMGn47H/i+N1PgKde3hNr9NfmPi1DcH/HU0lz1vqix06stD7H95YuLYh6H9yoBpGqM9vsv0/u96acCxADcCIc6gBhNPBEHSBqY7I3ookvZ9A/AtEA7PpD2Bieg3jw2g/B7lPPvayH5HEfwLVrQIAgGSE9T4ISYoAAAAASUVORK5CYII=",
  		url: "https://tp.m-team.cc/torrents.php?incldead=0&spstate=0&inclbookmarked=0&search={{IMDB_ID}}&search_area=4&search_mode=2",
  		noResultsMatcher: "Nothing here!",
  		noAccessMatcher: [
  			"The page you tried to view can only be used when you're logged in.",
  			"該頁面必須在登錄後才能訪問"
  		],
  		category: "priv_tracker"
  	},
  	{
  		id: "myspleen",
  		title: "MySpleen",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAQADBgIGCQUMDwsUFRMlJiQpKig8PjtWV1VvcW6Agn+LjYqanJmtr6zk5uP8/vu9nTxiAAAAhklEQVQI1wXBIQ7CMBSA4b/MkSavLyEbisyAnsEAlyAoFOkRqsFzgF2ATE3OYRBNyKYqEBykCs33oaqgqlzT2JDSkzPiFwN3DkeyUEbIZv9zAsY2u5YM2AClB+gdAlBEZt8aWL8N8wAIS6oTkJ0MxejYevJU28CFTWch8kCoIite6ePMLU1/u/4gmvtLPBsAAAAASUVORK5CYII=",
  		url: "https://www.myspleen.org/browse.php?search={{IMDB_TITLE}}&title=1&cat=0",
  		noResultsMatcher: "Try again with a refined search string",
  		noAccessMatcher: "MySpleen :: Login",
  		category: "priv_tracker"
  	},
  	{
  		id: "morethantv",
  		title: "morethan.tv",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA90lEQVQ4y2NgAIKFskr6QFwFxD1AXIwFFwFxJRD3AnEOEHsCMRcDVLMyEBcAcS0QFwJxOdSwSiRcBTUoCYgPAfF/IH4OxHogA7iBmI2BBABUfxRqyFQGcgBQ40KoAfPQJXaDJAbGACBnJlQQGb+DyhlD+bvxGZAGxHehEjNhrgHiUGjMgNjlRHsBqhFm2BkoW5AoA5AUvkPyziokdYtwGbAKSYMLktPBfGIMUII6eSaUDeN3EBWNZCUkIMEOxMwkGrAHasAMEEcdiHOhuQyEs3HgLCCOBuLNUM2/gdgRZAALECdAnTULZCoOPB2UeYD4ABBvA2sGAgCUmORTQ4TyTQAAAABJRU5ErkJggg==",
  		url: "https://www.morethan.tv/torrents.php?searchstr={{IMDB_TITLE}}&filter_cat%5B1%5D=1",
  		noResultsMatcher: "Your search did not match anything",
  		noAccessMatcher: "Login :: morethan.tv",
  		category: "priv_tracker"
  	},
  	{
  		id: "pixelhd",
  		title: "PiXELHD",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJElEQVQ4y81Su23DQAwleSdZyQwp3bgJ4CYbZItskCF0N0CWCZABXLtx5TarmP+zkPTJATRxlPx+FMBfH5Sfz/OxFXoArbLA6/NXO13feLbwbAfSX/Yf7fLdG+l9B4QzHJ7eWxUAvqxEMxBN+oBPI5xWLrDS1xrqrAJ66XsK4KhWCqBdSgAdNAkCWI4poLkPNnvAvQuL/SlmtQe7qzKASo/m3z2bAruHOpstpoCGKlfA3oSJjHFkYEwjg7piZlBGBgWZhRGju61kurOVoW4sMGs3BRMjb/3SSFx6F2aEEgoMoGgGS24iMhAFooruNiMKcKzWFaTfVKB+yb2GX2Ze7U5aI4PwyxbKD7+bNbJ8JoKqNlIBs+Z3gL/sPPxy78qshfA/zg3BTB3oJfB2bgAAAABJRU5ErkJggg==",
  		url: "https://pixelhd.me/torrents.php?groupname=&year=&tmdbover=&tmdbunder=&tmdbid=&imdbover=&imdbunder=&imdbid={{IMDB_ID}}&order_by=time&order_way=desc&taglist=&tags_type=1&filterTorrentsButton=Filter+Torrents",
  		noResultsMatcher: "Your search did not match anything",
  		noAccessMatcher: "Login :: PiXELHD",
  		category: "priv_tracker"
  	},
  	{
  		id: "revolutiontt",
  		title: "RevolutionTT",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUMCwgjDAs6CQdjAAAcGRa/AAEqKStMS0xlZGaDgYWdnZ2wsbLEyMng4OHw8PD9//zHkXC8AAAAkklEQVQI12P49w4M3jM8SwODPIbqMw17TnsxrGDgm3HsRUcewxOG3JXHbhbwMlxjyD1fcLuBj+EZg29WyYtyro4FDNUMW87eYTjDBpR0EHFkEOFl+GAaGgxE/AwPhIMVhUwN+Rh+LQhYtYqVaz3D/y+B//+7yv9n+P8w8P0/UTkg44HB+3/MfEDGs7T3/9Ly/gMA8vZDS4HIj1IAAAAASUVORK5CYII=",
  		url: "https://www.revolutiontt.me/browse.php?search={{IMDB_ID}}",
  		noResultsMatcher: "Nothing found!",
  		noAccessMatcher: "Revolution :: Login",
  		category: "priv_tracker"
  	},
  	{
  		id: "rutracker",
  		title: "Rutracker",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB/UlEQVQ4y5WSX2hSYRjGva+LZuxiENFgMGi728W6WS0GwcYSxiDHWETQKMkrLyJIJLySw6CLGaiDoWLCbgQZDSLDCy8StByiYejx+Ac2jgdt4nYgEJ9639jZztraeuDjcD6+9/c97/s9BsM5yufzkGUZhv+Voig4VDweR61WQ6vVujhIFEUcuDfwY+EljqtcLqNer58NqlQqaDabUFUVytgiZOMkL2V4jgEOhwMEP7WYyL1eD8lkEtsPX2jFtH5++Izp6Rl4PJ5/t/EoN84O6ODu4Kx2+74Q4L1YLKYHFAoFvNt9g7e1V3gtPsad1BW2Gg6HsT2+gP33Cf5X/ZuQJAnRaFQPSCT+HKDC48slPed9r3cdExO38WR5GdlslsE0Jw1QrVbR7XZxN31VKw7urHCx1WrF5b4HuDbkxfziJ1htH5HL5RAMBqGbOunZtykEdgStBbp1ZPQeLvWvou/6FxhvVLG5pSCTySAUCkEXmHa7zdYikQi+H2QYYLFY+FYqNA7KvEhmsxnp9NcjAFny+/3w+Xxwu91wOp3odDr8ZJS+gWEZN281sPR0D2sBlUNELjQAPVmpVOLB0Jec0GBdLhcfnrzfhCh1dWn86ylPiuJaLBZ56pRIk8nELdlsNtjt9vMBhyKrgiBwiwQkR5SFRqNxMQC1lUqlzs7+b/0CJa7qHxjMpcoAAAAASUVORK5CYII=",
  		url: "https://rutracker.org/forum/tracker.php?f=100,101,104,106,110,1102,1105,1120,1144,1171,119,121,1213,1214,123,1356,1359,1386,1387,1389,1390,1391,140,1408,1417,1449,1457,1460,1498,1531,1535,1576,1642,166,1669,1670,1690,172,173,175,1798,181,184,188,189,1900,193,194,1949,195,202,208,209,2097,2109,2198,2199,2201,2220,2258,2339,2343,235,236,2365,2366,2370,2391,2392,2393,2394,2395,2396,2397,2398,2399,2400,2402,2403,2404,2405,2406,2407,2408,242,2484,2491,252,265,266,273,312,313,33,352,372,387,4,404,484,489,504,507,514,521,536,539,549,572,599,606,625,636,721,743,79,80,805,809,81,812,815,816,819,820,822,84,842,85,856,877,893,9,905,91,918,920,921,93,930,935,990&o=7&nm={{IMDB_TITLE}}%20{{IMDB_YEAR}}",
  		noResultsMatcher: "Не найдено",
  		noAccessMatcher: "Введите ваше имя и пароль",
  		category: "priv_tracker"
  	},
  	{
  		id: "secretcinema",
  		title: "Secret Cinema",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABGklEQVQ4y52TwU7CQBRF70whpunKaOKia1ExJJQQKSHQDQnTwNqFJv6HqB+HGwIL/ogeFxQDgaLlJXc397y5b+ZJxRVIqucKVLICSaEnoY3CMpBAUihj6FmLkTAlIIGk0BhDYi04xyKK0D8hm87WMKxWwDky51inKat2exulELLpLEMl9ulK4EZkzpGlKfNmcxdwAPm9tk0uiJlwv3wiyiGzRmM3wlFIXUZURwEdxsTZmG424fa7Tcvzisxb1U8CvMtWftCcBOxF6DKhtuwgP6L/AXfPsyLIkTnIUI195Mf0v2DwnpFMMx5e5ifN+xArKjdDBp9bwJrG2+pP8+GLXCcMpvD4utiNUOY3CnvVy43m3H3wzlqmUuv8AxiQrl5+mZ84AAAAAElFTkSuQmCC",
  		url: "https://secret-cinema.pw/browse.php?search={{IMDB_TITLE}}",
  		noResultsMatcher: "Try again with a refined search string",
  		noAccessMatcher: "Remember me",
  		category: "priv_tracker"
  	},
  	{
  		id: "sdbits",
  		title: "SDBits",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAwFBMVEU4MzI9ODdAPDo/PUFHQkFFQ0dKRURNSEdOTFBRTUtUT05WVFhZVFNaWFxdWFdaXFleXGBjX11iYGNfY2ViZGFmZGdoa2tsam10dnN4dnp8gYOAgn+DgYWHgoGHhYmHjI6Ni4+SkJSQko+PlJaUlpOWm52gop+jpqmmq66wrrKusK22s7iztbKxtri5vsDAvcK9v7y9wsTGyMXKx8zEycvL0NPSz9TP1NfY2tfY3eDg4uXi5OHl6u3r7er19/T+//wwetPpAAAAuUlEQVQYGQXBQUoDQRCG0e+vbpOZCDGKATeiF/D+Z3HrQkUIRIOM091V5Xt6KUVSghJiZB1EKUmisHCyxijhUIBGMGqQ05TL2AJjEDa83KjO7Xqe93fpXte69y8ITqs93H5g0S7l2JfGWJfTpjdzP79tnmtntP4nD+vdf1790QmPqXe3YJv+mwa2uz9bVM/D0cv74In4/iS0Mx10AQBcqa3JSEoKCEJXGBKCsFCmZAgMAAIEAqQEpYJ/PYVr7Cf70N0AAAAASUVORK5CYII=",
  		url: "http://sdbits.org/browse.php?c6=1&c3=1&c1=1&c4=1&c5=1&c2=1&m1=1&incldead=0&from=&to=&imdbgt=0&imdblt=10&uppedby=&imdb=&search={{IMDB_ID}}",
  		noResultsMatcher: "Nothing found!",
  		noAccessMatcher: "Login :: SDBits",
  		category: "priv_tracker"
  	},
  	{
  		id: "scenehd",
  		title: "SceneHD",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEV/qheEpTuJpUSUrFmlrJKFvzePwwmHw0OPw0WSxkiTyVKayFKbylyjy16kzmim0nG8x6Gu03Ox1n2214a+3JHB35vJ4qbQ5K/S6bnb7sbj8dDp8tnx9+b0+/D7+vH9//wlkKjwAAAAhUlEQVQYGQXBAW7CMBAAMN8lpS0Uaf9/JdNUUIOSzI6fvwmAeEbpe5msrkFvmWNXosfzYVJ2GaxLX2QBEqMcBxVItO1INrOgRDW1miNuY2t6Yp7vIdu8JyrEvBbb65tIAPGYAwksqBUSZl0RCRXm7nSLLySEfv5eCdJHcUUpLYSPqAMA5D83oy6GLHgNQAAAAABJRU5ErkJggg==",
  		url: "https://scenehd.org/browse.php?imdb={{IMDB_ID}}",
  		noResultsMatcher: "No torrents found",
  		noAccessMatcher: "If you have forgotten your password",
  		category: "priv_tracker"
  	},
  	{
  		id: "torrentday",
  		title: "TorrentDay",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1ElEQVQ4y2NgGBTg9buPoi/ffJAghD9/+caPofnb959cKu7ZX6Ud0v4SwnJO6b/sY2tvrth6JAVuANBkqZzmOUtA2Dmh/qq0fep/p/j6q9lNs5fLOKT9AfL/ptRMW5fbPGdpVHH/HqDYXym7lL9rdh6Pw3ANSBPIgKWbD6a/evtBEmSAumfu5z9//rLC1MxYsbMUpMY7veU0hgHOCQ1gF5y/fs/i8JlrriC2b2bbKWQ1b959lASJg7z94+cvdqSw+MGj5Jr5XcE54wcosOas3l0IUljStXA+sgGfv37nB4mDXPftx08uuMTV24+MQP61ja6+DeIXdy6YD1I4Z/WeQmQDLt64bw4SNwoqeQr0GjNcYtX2o4kgifT6GWtAfKAfz4L4R85ec0U2oHna6l6QeEH7vMUo/m+csnICSGLCoi11P3/9Ytfwyv0gbZ/y9+37T5IwNcfO3XBRdsv8DorOizcemKIYEF7YuxdkwK6jF/zvPX6hBvKONDC6QNEHwuGFPQdAGkHiExdtqUXR/OfvX2aDgOKXIMknL94objt0LgRkGBL+Cwpc95Sm8xv3norCiL6/f/8yPnjyUu3hs1dqIP7Hz98EQXw4fvpK9ePnr4IMgxIAADHZLOhr31AHAAAAAElFTkSuQmCC",
  		url: "https://www.torrentday.com/t?q=tt{{IMDB_ID}}",
  		noResultsMatcher: "Nothing found",
  		noAccessMatcher: "Forgot Password",
  		category: "priv_tracker"
  	},
  	{
  		id: "torrentleech",
  		title: "TorrentLeech",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAQAWGBUgIiAuMC0gOwI/QD4rUwVHSEZPUE5WWFU9bwNdX11EggRzdXJ9f3yIioeRk5BlvgSdn5ynqaZ12Qy0trOO4DrCxMHMzsul5ly164Dc39vF75rn6ebz9vL9//x/BKLsAAAAnUlEQVQY013O6w6DMAgF4KOuVqe9aFdvXeH933J0RrOMH4fkCwTAf4USQVsJZ5T5QvSOKmb7PhZkEnBMpZljn7BmcLAF4Id9GREEOiJKYa318npiTuCGKLveoLnAVLQNQF9fwHUBQ/dE2bGIrH4hgri7oSJa5axapvYEbHH2EdU0Pk7oYbSSO2MrII9R0pBqVIkowHkLzroQg/cx0QfQvhJWgfnK2QAAAABJRU5ErkJggg==",
  		url: "https://www.torrentleech.org/torrents/browse/index/imdbID/tt{{IMDB_ID}}/categories/8,9,11,37,43,14,12,13,47,15,29,26,32,27,34,35,36,44",
  		category: "priv_tracker"
  	},
  	{
  		id: "uhdbits",
  		title: "UHDBits",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAADoAAwLIHT8AAAAAXRSTlMAQObYZgAAAB5JREFUCNdjOFfDcK6O4VwxCjr/GYTQBP/VMfyrAQABUxWboqH36gAAAABJRU5ErkJggg==",
  		url: "https://uhdbits.org/torrents.php?action=advanced&groupname={{IMDB_ID}}",
  		noResultsMatcher: "Your search did not match anything",
  		noAccessMatcher: "Login :: UHDBits",
  		category: "priv_tracker"
  	},
  	{
  		id: "partis",
  		title: "Partis.si",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAf5JREFUOI2NU0toE1EUPTdJhxEDkcFiHNy4EKHSVVeRiNDGH4gfCAZKK5hC7U5xm5ULCdToSqa4cuFCi4GagYLWJlgJRVyFSLpyZYV0hkk0MJDJZ+a6qI6TdKqe5XnvnHfO417ABzbzuB/vh8A+5KTNPP2/Ji4c5lFmTr5YXn45MzvbXykU7v1LQx7xfDabXazX6xHDMGBZFhzHgSzLpSeKcilE1N23gsMcy2Qyyrft7Yiu6xAE4SsAJKamHi4pytUQUZfXY1d4PTbmG6NSrT66vbDA6bk53WYeq1Sr82vF4h3vHd44J/D7xCYXT094+RAAaJqGdruNG6nUUpBoy2aOBolKA13Pvuvyh8sPwL01fjt+ii583nErnE8kPgUDARyT5RYADIv/FA69ATsm+tbiwB8AWJEk6Uu5XJ7wFf5OEX9to2dWGs3v05wXJdeAiLq5XO5urVa7zsyjw0L+OCNw+drucHW0A/2OGQQQ9yYAEa2m0+nHqqre3/N0p6GgXRe4cDRuGM3JX2wY8MyB+9ruBG4RUYVLZyJw+k8No5E6PKJtGK1O3HYQDIswD4o4QUlrZ4+Ba7R68jjQ39SNVpR7pstLYTRHQrhFSUv1TTBgkhejAJ5pP3DxyCE8B1ACoFLSav5NN2wicF58xXnRd0N9t9ELSlpdADcBCH7nPwH5s9ovTMQ+qQAAAABJRU5ErkJggg==",
  		url: "https://www.partis.si/torrent/show?keyword={{IMDB_TITLE}}%20{{IMDB_YEAR}}",
  		noAccessMatcher: "Pozabljeno geslo?",
  		category: "priv_tracker"
  	},
  	{
  		id: "torrenthr",
  		title: "TorrentHR",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABfUlEQVQ4EaXBu2oUYRjH4d//nW9mT0nWmFUQYUnAziI3kMrau7CMlWUaWxtbrawt1Ea0zQUIKWwsRFhZJBEPECJxDzPzvX6bDSmETJPn4apEMn7+7On3V68fqd1GJkB4XROu9X+t7+w82Nx9+JZLBJL215+d9YMR6nTBDAReVWQb1+kOf9MkkHgeVBcF1srBDBzchIoCt0ATIxHGpUSjwIIACSSQWBJI4DQKJF6W+GSCS2DGglcVPpmCiSaBxHorq9mNAdbtAAYGlBXZYKPns3lJA5HMv4zuVd8Ot8mymnMKWe1VHU7evLs9+XDQt7XVOdFBgJMpD8fD9y/3AklxZ2sf2CcpR2MjUZF7dfJnUB4evZh9+nzf+msODs6C1CqOgb3Af/KtYeTcj8dPoopCmAkhEGfcwTQlCTRQyIUEJpDAAQMiIDmJ0cAdcMBZMpbEhUCTspTP5hZP/0IewJ0z0VGMgSTQINy6SZxNW+3tu9hKDxwQECNqFR3GH7myf6AifLRWXQhrAAAAAElFTkSuQmCC",
  		url: "https://www.torrenthr.org/browse.php?search={{IMDB_TITLE}}%20{{IMDB_YEAR}}&blah=0&incldead=1",
  		noResultsMatcher: "Ništa nije pronađeno!",
  		noAccessMatcher: "<div class=\"glavni_naslov\">Login</div>",
  		category: "priv_tracker"
  	},
  	{
  		id: "goldies",
  		title: "Goldies",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOklEQVQ4jWNgGCzgPxImRhynImTFuMQHoQHoiokRJ+gCfBhdL9kG/Ec3gBDAaeDgMYDiMCA7FgYWAAC9BXeJOf+x+wAAAABJRU5ErkJggg==",
  		url: "https://goldies.in/index.php?action=search2&advanced=1&brd%5B7%5D=7&brd%5B8%5D=8&brd%5B9%5D=9&brd%5B10%5D=10&brd%5B11%5D=11&brd%5B23%5D=23&brd%5B26%5D=26&brd%5B27%5D=27&brd%5B28%5D=28&brd%5B45%5D=45&brd%5B51%5D=51&brd%5B54%5D=54&brd%5B56%5D=56&brd%5B57%5D=57&brd%5B58%5D=58&brd%5B65%5D=65&brd%5B66%5D=66&brd%5B68%5D=68&brd%5B71%5D=71&brd%5B74%5D=74&brd%5B75%5D=75&brd%5B76%5D=76&brd%5B81%5D=81&brd%5B82%5D=82&brd%5B85%5D=85&brd%5B88%5D=88&brd%5B89%5D=89&brd%5B91%5D=91&brd%5B92%5D=92&brd%5B93%5D=93&brd%5B94%5D=94&brd%5B95%5D=95&brd%5B96%5D=96&brd%5B97%5D=97&brd%5B98%5D=98&brd%5B99%5D=99&maxage=9999&minage=0&search=tt{{IMDB_ID}}&searchtype=1&sort=relevance|desc&submit=C%C4%83utare&userspec=",
  		noResultsMatcher: "Ajustaţi parametrii de căutare",
  		noAccessMatcher: "<a href=\"https://goldies.in/index.php?action=login\">te autentifici</a>",
  		category: "priv_tracker"
  	},
  	{
  		id: "filelist",
  		title: "FileList",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAElBMVEUsLS8pTFsmZHwje54shKUfotVCbnToAAAANElEQVQI12NwgQIGBwYwYMHLYAwNFYUwAhjgDFUwgyk0EMJgDmAwhegKYGANDWAhymSYMwBdTQvkUareoQAAAABJRU5ErkJggg==",
  		url: "http://filelist.io/browse.php?search=tt{{IMDB_ID}}&cat=0&searchin=0&sort=0",
  		noResultsMatcher: "Try again with a different search string",
  		noAccessMatcher: "FileList :: Login",
  		category: "priv_tracker"
  	},
  	{
  		id: "alpharatio",
  		title: "AlphaRatio",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUVKl4IOLICP6oAR+QeR5oASfgZTc0AXP0YYdMdarlCYqULcM0Ac947ZMg8ZboAd/8Df9oAhPRAeKk3frxkfLxkialYksSEiJxil7+WobqjqbKjrMKwu829wcTFyMvHycYBkkjPAAAAgklEQVQY02XP2Q4CIQwFUEadQaTIUhcQaP//LxUzDC73qTlpb1LBPxF9KPQFlJc0IDpQAKCR+sbNC3OZhXcdot+VOk/a0wYHZrNXvm5wZ86T+zipTEnbMkqJYgSZVqBja+NslxWSbG1MIMsbaLH+0QCtoRfUoBDDlSkgnk/jub9ve560zBnJ3AgNNAAAAABJRU5ErkJggg==",
  		url: "https://alpharatio.cc/torrents.php?searchstr={{IMDB_TITLE}}&filter_cat[1]=1&filter_cat[2]=1&filter_cat[3]=1&filter_cat[4]=1&filter_cat[5]=1&filter_cat[6]=1&filter_cat[7]=1&filter_cat[8]=1&filter_cat[9]=1&filter_cat[10]=1&filter_cat[11]=1&filter_cat[12]=1&filter_cat[13]=1&filter_cat[15]=1&filter_cat[16]=1&filter_cat[17]=1&",
  		noResultsMatcher: "Your search did not match anything",
  		noAccessMatcher: "Recover Password!",
  		category: "priv_tracker"
  	},
  	{
  		id: "beyondhd",
  		title: "BeyondHD",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAM1BMVEUgAAALPOoMRtIAUt4eTb4eUNEZVc8bWcgcaMwlachwcP9gfvKMkv/h5f/s7f75+f/9//zal4f2AAAAAXRSTlMAQObYZgAAAGRJREFUGNNNT0cCwCAIo9aBHcL/X9uy1FwwEUgAEJz4o0CgoKMZxw3rv5uQZwM90eILmGONtLOCWOZ04jXlxhDwEn7gEqoIVZ0giyPxGEzuK2WokSfbg1r4jXc7JgWv816Vkj4/5zEHVLDKOPkAAAAASUVORK5CYII=",
  		url: "https://beyond-hd.me/torrents/all?search=&imdb=tt{{IMDB_ID}}",
  		noResultsMatcher: "N/A",
  		noAccessMatcher: "Sign In",
  		category: "priv_tracker"
  	},
  	{
  		id: "danishbits",
  		title: "DanishBits",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA/UExURQoSEhISEp0KC8oBAaYAABISEhISEhISEhISEhISEhISEoszM7EqKlQFBakaGi4ODhISEuAAAIwBAbsCAkdwTOrekeoAAAAVdFJOU///////B4nA9Xq9//////+X////AOfooCAAAAB/SURBVBjTZY/ZDoMwDATHzg2Eo+X/v7U2FJWKlUbebPywZjelXGotObnHaPJVO4PBLGcyeLCaGUcMM+tO8p9pwnCXyLbPPCMGSKZ0dSHH6IWqcVliRKLNl1YP/OEIHhQNSDgQohayblzFeGsm9fDT1hN746Z2VZdb9edx/+d/AJJ9BpNvXJ6TAAAAAElFTkSuQmCC",
  		url: "https://danishbits.org/torrents.php?&pre_type=s_imdb&search=tt{{IMDB_ID}}",
  		noResultsMatcher: "Your search did not match anything",
  		noAccessMatcher: "Glemt din kode?",
  		category: "priv_tracker"
  	},
  	{
  		id: "funfile",
  		title: "FunFile",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAEpUExURSgeEvHeodO+hhkGAigVD+/coSgIACgeHAgAAP///w0CAHkALT4AQTQAMrYAAG9SAKQIAg0eHBgeFBwRDyEeEV9+kWMAFBQJBR0MBdSlXcWWV49YkO/dqC0dFixjja4AAREeHDGR0ZwGBBYWGiETDBchJ///+kGc2g8SFC0qKJGEVncAJayYW9PDkbm7wfzq12ZJAO/KhuPT0DEANbWKGcRxA/EMAOi8b+EgAP/35jUDQZAABraxqe7X7zGR2nsBNmMALlYADjp3nv//6iua4lal2iVtmjGr90M4NmxOPfjbuh88T9rRsFIAFf/alOXQmE8fX//q13W06/L095RuEa+nnLG1t1VBN62Zj9GebKDW89+1d+He3YlyOltaW7XGztTIxefk45Z7Ofn+mBAAAADnSURBVBhXTc7VkoNQDAbgAIceQRYoXurUvevu7u76/g+xYfZm/6vMN/kzAQBwXcdxKhXbtut5CqAbxsqWaZat2qplziA0CgVfswBq5aWF+TkszC7yPslhSBAtryHo/vpmrlTdKBXT7SZWiNHukWJ152DvENgJgnK0q5F031NOO+n5WZcCk7keHrdaN14n6MYqwqCphd7wYfiiBeM4Qbi8qoPyOP0M3cbz3T0FIY9uSTv6mv70xOtgkt24fsp/cExfeR9lN2T+xgj+AyGL+R/wb18IwcYRzyCQVFWVJokkJThc0Gz3f+gvLXEa5jgc07MAAAAASUVORK5CYII=",
  		url: "https://www.funfile.org/browse.php?search={{IMDB_TITLE}}",
  		noResultsMatcher: "Try again with a refined search string",
  		noAccessMatcher: "Recover Password",
  		category: "priv_tracker"
  	},
  	{
  		id: "zamunda",
  		title: "Zamunda",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEVMoPldofBQpP5dqP12pNxrqOeCptR4tP6asMh/u/2Wt9+bt9ipwNiVxPquwtS6ytuqz/620fGz1P7J3O/D3v3W3ePS3uzM5Pzf5u7n6ebf6/zu7+zq8fj1+v37/Pn++/999v/9AAAAqklEQVQYGQXBwXHDMAxFwQeQIuVMnIkbcP+lJTdfREui8OFde5I2I6D44iT2JGeUClzQwDMP3ZpL1pre4OysMP7/XslqJ36oJ3kkI4xV8mGZygEZmMXlhqQ9gQhNe/uugA2gEFEuv97nOAF6zGCmLdGhbgC/y7jcWx4VAJivsVf/qmzaANhm1pu3LiYAgHrxcl8lAEDrvXguj5+aQkr/fizYE+I8D+G9dYcPc99n6tTCltoAAAAASUVORK5CYII=",
  		url: "https://zamunda.net/bananas?search={{IMDB_TITLE}}",
  		noResultsMatcher: "Sorry, nothing found",
  		noAccessMatcher: "Not logged in!",
  		category: "priv_tracker"
  	},
  	{
  		id: "os",
  		title: "OpenSubtitles.org (en)",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAKlBMVEUAAAAREREiIiIzMzNERERVVVV3d3eIiIiZmZmqqqrMzMzd3d3u7u7///9SrzZ+AAAARElEQVQI12NggAHeC3fBCMHAAjjuTmA6ewfIyGCYxuUgDWRsYpDmdgBJHWSQYbm7GSzVzs7gDWRw3p3AdfYqNmNw2wUAUH0dtNO4HWIAAAAASUVORK5CYII=",
  		url: "https://www.opensubtitles.org/en/search/sublanguageid-eng/imdbid-{{IMDB_ID}}",
  		noResultsMatcher: "</div><br /><div class=\"footer upfooter\">",
  		category: "subtitles"
  	},
  	{
  		id: "os_all",
  		title: "OpenSubtitles.org",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAKlBMVEUAAAAREREiIiIzMzNERERVVVV3d3eIiIiZmZmqqqrMzMzd3d3u7u7///9SrzZ+AAAARElEQVQI12NggAHeC3fBCMHAAjjuTmA6ewfIyGCYxuUgDWRsYpDmdgBJHWSQYbm7GSzVzs7gDWRw3p3AdfYqNmNw2wUAUH0dtNO4HWIAAAAASUVORK5CYII=",
  		url: "https://www.opensubtitles.org/en/search/imdbid-{{IMDB_ID}}",
  		noResultsMatcher: "</div><br /><div class=\"footer upfooter\">",
  		category: "subtitles"
  	},
  	{
  		id: "os_ro",
  		title: "OpenSubtitles.org (ro)",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAKlBMVEUAAAAREREiIiIzMzNERERVVVV3d3eIiIiZmZmqqqrMzMzd3d3u7u7///9SrzZ+AAAARElEQVQI12NggAHeC3fBCMHAAjjuTmA6ewfIyGCYxuUgDWRsYpDmdgBJHWSQYbm7GSzVzs7gDWRw3p3AdfYqNmNw2wUAUH0dtNO4HWIAAAAASUVORK5CYII=",
  		url: "https://www.opensubtitles.org/en/search/sublanguageid-rum/imdbid-{{IMDB_ID}}",
  		noResultsMatcher: "</div><br /><div class=\"footer upfooter\">",
  		category: "subtitles"
  	},
  	{
  		id: "oscom",
  		title: "OpenSubtitles.com",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAqklEQVQoz2OwYYBCdZtemzM2f4DwDJClDhOHSRfZfLP5jwS/AUXgCthstqNIwuB2oAxYwQSwsZjwD9AqoAJdICMQ7hJk6AeU0QLpv4dVGgSv2vQy2NywOYZTwQGbqww2P2324lSwxeYDIQWfGWxug61wtUlDgx4wKyZDHcmDIs0DdeQEiDdDcHpTF8SYDAy1MzYzUeAcoMh/YBAQF9QEIwsR3efBkueRoxsAObyh4yjmXBMAAAAASUVORK5CYII=",
  		url: "https://www.opensubtitles.com/en/en/search-all/q-tt{{IMDB_ID}}/hearing_impaired-hearing_impaired-1/machine_translated-machine_translated-0/trusted_sources-trusted_sources-0",
  		noResultsMatcher: "No results found",
  		category: "subtitles"
  	},
  	{
  		id: "oscom_ro",
  		title: "OpenSubtitles.com (ro)",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAqklEQVQoz2OwYYBCdZtemzM2f4DwDJClDhOHSRfZfLP5jwS/AUXgCthstqNIwuB2oAxYwQSwsZjwD9AqoAJdICMQ7hJk6AeU0QLpv4dVGgSv2vQy2NywOYZTwQGbqww2P2324lSwxeYDIQWfGWxug61wtUlDgx4wKyZDHcmDIs0DdeQEiDdDcHpTF8SYDAy1MzYzUeAcoMh/YBAQF9QEIwsR3efBkueRoxsAObyh4yjmXBMAAAAASUVORK5CYII=",
  		url: "https://www.opensubtitles.com/ro/ro/search-all/q-tt{{IMDB_ID}}/hearing_impaired-hearing_impaired-1/machine_translated-machine_translated-0/trusted_sources-trusted_sources-0",
  		noResultsMatcher: "Nici un rezultat gasit",
  		category: "subtitles"
  	},
  	{
  		id: "titrari",
  		title: "Titrari.ro",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUklEQVQ4jWP4TyFggDMYGOAYxscljsJHMY2BgWg2RQag8KnqAnIAhgEEA42BgbABxNAkuwDdAopdQLtAxOYiolMiLgPw0sS6AKeB5LiAJC8QAgCeHTD6g6g9uQAAAABJRU5ErkJggg==",
  		url: "https://www.titrari.ro/index.php?page=cautarecutare&z7=&z2=&z5={{IMDB_ID}}&z3=-1&z4=-1&z8=1&z9=All&z11=0&z6=0",
  		noResultsMatcher: "1-0/0",
  		category: "subtitles"
  	},
  	{
  		id: "subs_ro",
  		title: "Subs.ro",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB70lEQVQ4T52Sz0siYRjHv69jvqOORa42IsUSSVCHyPYW5F8QQYeiQ3TrFlgJQYfYICEio0BIy4XYCoSOQf9BdQvskEGwG2Sjjf1YCq01k2ma3WaaKFr3vb3v8/1+3uf78JDJNjrkPpPC/AXKOqcuggsn00m+8VT69KssryoWXADZoFT6P/sfF4m/AzBQCtfgoKwgEFdWUMrl3vyHfH8D8GVvD5nlZaSXlsD396N2ZEQxJ3w+lPJ5HYjEWFYXwbu9rQh+jI3hZncXnNeLhrk5JHt74ejuRiYW0wMWXwAMZjNatrZUQS6RANfairRsysbjyru1uRn5ZFLVkHnWrHbgGhjA2eqqUmyMRpR2xbU11E9NIR2JoKrDh+LVJVKzIQ0wa9YAvAwQ/wLqZ2Zwn8kgu74Oj2x+Pjc7OxAWFjRA8AWAsdnQEA4rxduDA1Q4naioqcFPvx8P19dw9PTg7ugI+f19DfDVYtEN0SNPvpBKIRUMKiJPNIrjQECJY+/qwtXmpn6I468ABpbF5+lpnExMwFhdDffoqGoQQiHcC4IeEHgFeK7SujrY2tth4nmY3G48ZS/JMYrn57g9PNQiDFutH64yYRgwHAejw4GiKOq2kvjtFumhQHRt/euFVkogQ02muCFr7Cv+Lg9COQkFeyn6CGYzrvfqxi2AAAAAAElFTkSuQmCC",
  		url: "https://subs.ro/subtitrari/imdbid/{{IMDB_ID}}",
  		noResultsMatcher: "<div class=\"box-content error404\">",
  		category: "subtitles"
  	},
  	{
  		id: "regielive",
  		title: "RegieLive",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABRUlEQVQ4T2NkIADempvz/fv2vgGkjJ2NoY3v7K03yFoYCRnwylRbgvH7r0MMjIzcLMxM1oIXbjzAa4D34Q+C/z/9kv//758sAzPD64X1zg+INsBzy7O0//8YUhkY/yv//88gCLR1w+Im10yiDABp/vefoY/h/39uoMavjAz/f/1nYJq/uMmlm6ABIGf/ff9t13+G/yYgW5mYmToZ//97zsjH9Wl+kTU7QQO8tr4y+Pfv977/DIxsTAxMkdt9JTbDAoqoQEQxgJnJZbuXxIlRAxBhAE3KW4BhYglMH3Gil24vx0iJ+AIRpPi1rlodkKoF4s9AfAWIz/znYO0SO331BTgvEDIA6ooCYCKLAaYTRaCWV7B8ATYAlJD+ffhhA2IzCXAc2Wor8B5bJntvoKHwh4FB4f/ff1zMXIJHhE+e/EQwNxLKrQABCvARxzdFEQAAAABJRU5ErkJggg==",
  		url: "https://subtitrari.regielive.ro/cauta.html?s={{IMDB_TITLE}}",
  		noResultsMatcher: "Nu au fost găsite subtitrări care să corespundă criteriului de căutare.",
  		category: "subtitles"
  	},
  	{
  		id: "subsource",
  		title: "Subsource",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAALiIAAC4iAari3ZIAAAFySURBVDhPjZK9SlxRFIW/deYSiyFFIJgmhQSCBtLIKJI8QJpgkcI6vURLQ/zJ5Aq+Qhp9AouQLg8wgVQ+gYXFjEoQAilGEObslWLuTMbLCH6wD/ss1mKd4ogK2y3g0egOMBgMVBTFH0knk/otIqLjKeScO3UvgEZLRHSAReAjoIgQQErpPKX07VZqSvAlMF/pCYh+v0+z2TTgidz1eMs5/6w/8y5yzoeTjRvAM9uSZEC2BSRpaJP0EHgfEUfjxvtge862I+JQ7JdfgdWaR5jTvLv7pGpRNYWk2Yg4SpjHwFNwF+gBPeEe4jdwafvC9nk1XeDE9pkoy2PEGjkalGXUmu9E7JfHwBr4B0hggSxkE8DwqPjF5y8HAAnzF/sKtITdArWAZeMV0AroFeY16C3S0v/G+9BuP6CRbhDf2Wu/AyjqHgDKchOYRRK2kBt1S6oLQ7yO2AFvIz6Btoayx99uejD8hhzPq5kHLZDjBTP+MLL8A/yj4Hf/p5fsAAAAAElFTkSuQmCC",
  		url: "https://subsource.net/search?q=tt{{IMDB_ID}}",
  		category: "subtitles"
  	},
  	{
  		id: "turkcealtyazi",
  		title: "TurkceAltyazi",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABWElEQVQ4y2N48+yBzI0ZEUvv9TvtJgXfmBqy4s2TO4oMt1bX1f2qYfj7u5Y0DNJza2lRF8PdhWnTPjaK/H02zRuMX3Yb/33ToQ7nw/CrZsW/z6d6gtnPp7j9/V7N8Pf+gqRZDCDi+WTXv////wfjlwfm/H25tQ3Oh+E7C3L/fnv/Esz+/vHd33dlTJgGvL918u/7Sva/L7AY8HJp+t8nrTp/f//8/vcb0IC3qAa4gBU9nx8D9htWA5al//0JlHt5bAWmC941iv99tav/7/tafnAA4TIAJPeqx/jv840Nf79VIYUBLFRhIYzPAGS1KAYgY0IGwPBwNAAUOG+ruP++OLYSw4Bnu6b8fV/FiWnAnYUZU2ACoHh+vHPq33f3r2LBV/4+3dCAEltgA26tbapGFvwBTONfK7Hjn9VomWllRRvDhzcvRG4tzuu7BzSNFHxrcc6Edy+fSAAA26Xexh5bDHkAAAAASUVORK5CYII=",
  		url: "https://www.turkcealtyazi.org/find.php?cat=sub&find={{IMDB_TITLE}}",
  		noResultsMatcher: "Bunu mu demek istediniz",
  		category: "subtitles"
  	},
  	{
  		id: "podnapisi",
  		title: "Podnapisi",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAGcAAADu7u7pQXccAAAAAXRSTlMAQObYZgAAACxJREFUCNdjEA0NYWAQXbWUgUFy1TIHECsAyFo5gUE0NBTGWrUSk4VNFigGAN4uGb2e9Kd3AAAAAElFTkSuQmCC",
  		url: "https://www.podnapisi.net/subtitles/search/advanced?keywords={{IMDB_TITLE}}&year={{IMDB_YEAR}}&seasons=&episodes=",
  		noResultsMatcher: [
  			"EL_COUNT",
  			"table.table tr.subtitle-entry",
  			"GT",
  			0
  		],
  		category: "subtitles"
  	},
  	{
  		id: "planetdp",
  		title: "planetdp.org",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACCklEQVQ4y52TuW8TURDG7TjG2Ht442M3XouKygVCqSIKCoSiiAqloKKMqBCFK0rEX5CaghpRIBEpIfEFPjY+Yie2YycmEakokIkogpWssffNx+4KW0IcwRQ/aY73Pr15M+MA4GTHzphx5LwzOJziLH8SHGPn2LFAH5zPBx3X/f8TMKH3bgVHUyl2ON0dHkzfnUiA2jxnNISg7XfcD03ADtyfhu1L1y4U6Nc9V6nFeWjP16QmtzI+0Pa0sO8BtTyF85on9kcBfdu7hIbgYg3+FZqXQQ3uxLTn7Zc1fHHs+YC2D8O6d0uveud+EfhW4Z5QdcbNqtIK7XKgHf4Hwr7dpR2e65e5HOo8LIwal+mX+Jt6UXDZAoOS+JJKAT8rBuNUFUAVEaj5gV2xc66Jdmu/ZIRHVDXjFjURlm1UxHu2gLElNZkWumLk5SWUJWB7hg016ZaV+5yQbuh5qWvGQGWTok2Jyv75cQlGPtijvDyHQmTR0AKro/p6qeA6SmZjTFjB5iNpgcWf/uDrRohj2TDYO3l5FDzdCD9lORnQwiArlw13WS702wFz9N7IUWRncbYpx09W5dvDtKIjp4DeKmAZhZk8/uscnL5WrlM6AiMZAWUiDJkIWMrmGUvPXrgbDn0tskBJFTYJFSyhvjAvK/+8C2dr6gMkomCb0RLbVGMTb2N/XV1GMhqf9OKI707vubLIERo7AAAAAElFTkSuQmCC",
  		url: "https://www.planetdp.org/movie/search/?title=tt{{IMDB_ID}}",
  		noResultsMatcher: "Sonuç bulunamadı",
  		category: "subtitles"
  	},
  	{
  		id: "addicted",
  		title: "Addic7ed",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnElEQVQ4y52SX0iTURjGv+hCcLlFbjqdbCqYi3Bb++dIZM5yJAWOOQnSiZiyRcsgHVqO0quaNHWKtdRqF1pRmRchQbgN1yS7kKBGi2KgSTaJLmbMwfDj6TtG4V3agcOB9z38nvOc96EAUDvdNE1T8Xi8KBaLHfxTo3YD8Pv9Y263G83NzfTCwoLxnwCiODg4ONbV1TXjcrnmOjs7U1arFWazGQ6HI/gX4PP5ag0Gw2etVvvd6XTeTKVSe0k9mUymV1RU0BqNBg0NDbBYLKivr4fJZIJer0+Se1Q4HFYxFzYVCgUUmkocNXTgnO1SwOv1OkKh0KnS0lKoVCqY6urQ1tYGRggEmJ+fj+XlZSHV19c3LJfLIZFI0drrh90TRXXrEHQ6HaRSKWrrTuPJs2mMeEZhtV2EWq2GuLgYWVlZWFxclFPt7e1PS0pKIFWWw3EvCuf0KoxXfTRjhxaLxTheVQXr+QvQlJVvASUSCex2O9hsNmZnZyup7u7u8WKGWHRIhsbhL2jyxKC/FiS+6cLCQvD5fAiFQnC5XOTlCSAQCGA0GiESiRAIBE5Qk5OTloKCAuTk5EBr8+Kk5wfKmJMoyWSyGI/HQ3Z2NlgsFjIyMsDhcEAEyasZCxoSjH1KpXKFKLE5+6GuNuNK7/UHS0tLomg0elhXeYwmPQJgsdKRm5u79Q81NTVfE4lE2tYYI5GImJntDOP7U09PT//Gxkba7xxsUq6BgftKlXo9k8vDgcxMHFGo0NRiWVlbW+PvKIlv34Ubn7946RwZvTtlbrEkas800vH1n7z/ivKtO+NvOi47NplF7RrAxHrP+3B4LhiaT5GI7wrgnXg4daPfnRi6PYqJR4+T23s7Aqx+iwlfzb82+eeCZz9EPlZt7/0CE7Nv5pEjH/QAAAAASUVORK5CYII=",
  		url: "https://www.addic7ed.com/search.php?search={{IMDB_TITLE}}&Submit=Search",
  		noResultsMatcher: "returned zero results",
  		category: "subtitles"
  	},
  	{
  		id: "msone",
  		title: "MSONE",
  		icon: "data:image/png;base64,UklGRqQDAABXRUJQVlA4WAoAAAAQAAAAGAAAGAAAQUxQSMoBAAABkG3btmlHO7Zt204ebdu2bds2yrZt27Ztez4cVD4hIiaAzKG0k7MgmUNRu/r991e4qXP9B59lyaqH//A6c6xbiQ2fafLi+78Pt77A146GKmUGPo3A6atXXwHrjbYBD0LleSicch4j1z7hcWT3bzydvg08dyNUve7jbw4Pvsf3woyPoL3tQOHOfAEsNTwGPH76j+6CCYVLqecvblReBdujWhTCFf8J+Pvt1cvPwNdXL78AWxVpFPYD3/aX+Xsnr9xa7O+dueHrEkkagUn8WWAuqqgooKAhqqgkqNLRJUJDgr88cOP037svlJO47zoQyaUbKEinc+WEDv9GYJc0/1JghxKfAi8d//Q+FdH9wEkVsa3AMT3CyUFHAtYwbQGO6hGWKlVKQvuAUyoim4Gj2mz4vP19Nj3/u1NB+8Dzm3tCJFnwdtxcX376wcGw1TdOtJw4vUidiX/49sapXYE7b24I3n92c+HhIA4GDqdNT/ac6Dl9e0Ru5ZkTfcmaXAzcEasXBJauqavMkCzKrt9YJEIYRWMTA9wDQkN9rT1DgwOiY3Q4GIRcY0vrCgq62gs6++vD/QN0OBk4+FX8U50dUzKT0wrStCTEeAkhBFZQOCC0AQAAkAkAnQEqGQAZAD6RPppJpaMiISgKqLASCWwAnTLjeniAzjOYkPUsW5wgdavzof6P08c4vz37Af6x9YAOMN4Zr13f2SKDSoOLHM4kBO9LvlT7Bq8uAAD+b3ezT2ALm3FkEEJPbsua2cQ3ScUujtclVou/6x3dEYBjU1NiEr8PxKQcpTa+V7g5iCxJl8G7MPO/f0+hQbX6YK+mktHydMEhXr3Xraoa9PBf6u6VYYW4syozkBu9/lIrl7krHqJnOymqdrPsaOWeYaie+FsDjYU9aH1pBSSx5gyrmvy+X9WiQH+J1GeBcYTf3Obdj7vab9hfRn6xFp/0glC/+mFtyS9koBya+QY88ojKEhknvLZgjk2CBOvUkbBNvhoBImu3VlFVA1XS2BmBziHoaO2DukBP3L7c/h/ASzShS97Ky3QQ1guIIt/z9du/r3QYxtfET8K0/qt1OPVhMcQPEtbq/9pBDoLj/81/Wk3KdEh6x3af8Pti7Yq2Ud0NAVFLEvxRv9Gz2W8s5Djo3ns6uxkPgJdYRZmTdTRnAGX/LhD0AluehfZLcvLZNqJ/901ghlNVXMNH7uAAAA==",
  		url: "https://malayalamsubtitles.org/?s={{IMDB_TITLE}}",
  		noResultsMatcher: "Sorry",
  		category: "subtitles"
  	},
  	{
  		id: "obniv",
  		title: "Obniv",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADI0lEQVQ4T1WSS0xcVQCGv3POfTB3LndmeMnQFhigPIspKRapSWMIxZgWo65kUVc+0iZqdGt0ZzBxaVyrMdpYYxRCq27aNKnRWo1RtLGprVEEApT3dO5w5557XFQa/Vb/5vtWv+A/HOwtqHJkDpzs2HP6wca6sXxL0x7LsWVxp7L+4ucXP7wdRmfR8spvt37Xu47cHQO9haCiebfBtS/31mae82yrVSlpSyFUtevUdddnXwJzAaU/6N7fFvwvcKivkBZSTOVd5+QLB9r9+kwOYwzlYgkdx2itKQw9SlVjmwtMgHmvu6PVuxcQUrwOPNzS10l59AirPS3YaY8wrLC5ssHW6gZ1R8cYeW2SpqHDAE8gxJs9fc1CDva3dQGnVdpDjY/wa1cbpGy8mixuTY5ULkMqG1AdzNK+9waPnDpGTWcLwDOmogYk8BTg1w8fJMjXAGAQGMFdBBgBsRKAwc9VMTB+GCCFYUICYwhBZn8LAjBhFfNhB0vZHrTjU6zL8OOx+9muTv1bhHx7E9JSAI9JoEtIieN7JIlBrzXzR984lwYn+PqB43zR38OC62PMPR+/NoO0FcA+CUhjDAiI4oi+7HVak9s4Dsz7OXa0w/Z6xJ2/1jALKwBI5YAQAJFsbghuPj9+CF0qM2KKnNDXeTz8iONL50isNnQ4jHv+B8yZGcrvzxDPrnDzXI7BrEfgqDnZWFt9aWyokxPRKg/FawitceMiDfxJU7KORRFn8Rp6u0gljIg+ncb66Tz7AocqS30pj/S3TtuWMqM9eZRtYbRGOA5EEfftrMHGMlHF4FiSRMcooWmWs3iOZWo9+ys5uteXdlxJpBQIy0L6aYgiLCWIv50jurqIZRLCSJN2HWwlkULgKPnJ0dbsRWlKpcH473lV2SpWAIRSlA3MfBfw/UYtUarAnBxASVDy7jnCir6yul069fKZy1osvvP0k8BZgxAmCJJSFFsfX5hlanYJhAMAJqI9bdPfmNWea7+9XIpenZz+pgQgIZkCJgVmWW5tXluaW3r2s58X3jJGXzVJuG6ScNMY/cutOztv3FjeHNbF+JVdGeAfnfo6umxNATsAAAAASUVORK5CYII=",
  		url: [
  			"http://obniv.com/ws4xct8/home/obniv",
  			{
  				searchword: "{{IMDB_TITLE}}"
  			}
  		],
  		noResultsMatcher: "aucuns resultats disponible",
  		category: "streaming"
  	},
  	{
  		id: "senscritique",
  		title: "SensCritique",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAABrklEQVQoU03IP0iUcRzH8ffvd88dd3Z3Vn41EYT+IEQRhwhG0iQhBA0FTZGRQlOY4tRQSEbQP9ucqqEhiAyCqHSpyCAKxKnCoamGizg7zIyu53l+n4aKeo0vym5Xhj9aHNDf9+zs98mw9z3HAcd6D1Sax7dfbZnM9+XGJhSrkf6IlQ6JKYDclpvT+hCWtawDYTAoTCVt2qwzaY+Kj0YzZKfvKCSX45F4Jt6XLqZvgld5uumY+1iaACK6VhqaCU5FeWW1ktyWewWwx6wEwIbV55ISJVrTXVXTd1r3ljxsPDWk/qeFCxRvbdX59J7u66VSrUnhhrrmOq9d/CYdkV/gaLb0MCOXoJw+aV7npLCqmhRfigvqOAz0zi1pNrmuJUnDQr0aTUaS7pBX6xUgOrRDj9PPcTWeDfvVpHYVQ0b+S+FB50HIezq6y/ORmkNJPhTUJkvbfm5S+xNo8a0eHLxww5V6xdWjk+lASMgAjio7a3VzNWHePFgENm4y2YK9NpmsB8yDr4VaME8GWAS+MljbzRjQB3j+MgfWag07AZYF22YDv/c/1mSnLTJnzqJ/+wvOaNU0GIyKQAAAAABJRU5ErkJggg==",
  		url: "https://www.senscritique.com/search?q={{IMDB_TITLE}}",
  		noResultsMatcher: "SearchNotHits",
  		category: "movie_site"
  	},
  	{
  		id: "rg",
  		title: "ReelGood",
  		icon: "data:image/png;base64,UklGRrgAAABXRUJQVlA4TKwAAAAvD8ADEG9BkG1Tf+d/GgzbRlK0/fd6zP8DCtu2bfT/w+mUhAQJ/xfbjNwMEcb3Q6IQPo/3Y2m8bSBKAQaq+0X5lPI8vi5MUOMIYvR/DNDngel9vw+j7wMFYb6u1wUThREEhpEkKTncnsfd3Y78I3yBCCL6PwEviv7iuERKtxeZK7JuScsRpmYxWVCztGjPnhVixrggAduAhoGInuIDRS71dvSTJw+egXY8vP8D",
  		url: "https://reelgood.com/search?q={{IMDB_TITLE}}",
  		category: "movie_site"
  	},
  	{
  		id: "ddlwarez",
  		title: "DDL-Warez",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACxFBMVEX///+bpah8jpGDk5h1ipBrhoxog4tsho50i5OFmJuQnqKMmp56jZJuiY9yhotpg4mVoaSDlJd4io9lgYeUoaVkfoSxt7lziI6Nmp1ifYZ8jZNdeIBGbHU+aXM+aXNDa3VXeYJ4kJVzkZiBoKeNrLOTsbmSsbiBoal3lZ12lZuPrrSkwsivztO11Nm4192519221dquztSiwslmg4qIpKujwcez0ti83eS64em44+vA5u685e285OvD5Om+3uSNqLCmx86x19614Omv4+un4eur4u2l4O2q4eyr4Oqu4eu85OyEoqqew8qn1N2s3+ew5O2j4uy+6vLl9/mk4evO7/TM6/GQ0+Gf2ORwj5aPtr6czdWn2+Wt4uuw5u+i4u296vPi9viQ2efF7PPE6PCBzduR0t55oKmOv8mi1d6p3+it5Oyx5++V3uqr5O/Z9PiG1+fA6/PC6O9+zduQ0d5bgYp7qbSVx9Gb1N+W1eKW2eWM2OZz0OOg4O3Y9fmD2Oe+6/O95+5vxdZ4xNNbiJKAsLqRx9KNzNei2OKZ1+OP1uON2ei36fLY9Pl91ue66fLJ7POL0N6JydZfjZmBsb2Hws6NytbW7/PW8PTW8fXX8vfc9fjL8PZ10eOu5O7c8/fU7vTT7PFej5p8r7qJws10ucdttcVxvc9zw9V0ydt0zN5xzN9lx9tqxdhvwdNuuMtrscJbjZl2rLd8t8RnqbqWydSd0d2c1OGd2OWd2eiQ1ONhvtF+ydia09+YzdmWyNRWiJRxp7RoprRdm6y319+/3+a+3+a84enQ6/HL6vBcs8em1uHW7fG63OO62N9Nfoxqoa5hoK5PkaJMkaNOmKtQnbBGm7CFwc7F5etTpbii0dqmz9hEkKRHjZ9DdIFflqVZlqZXmKhSlqhSmqtUn7BAkKV6tMDB4OZMlqidyNGgx9A9h5hMk6PvIwVdAAAAInRSTlMBBz2Dt9nt6c+naz2v8XXxBYt1/TvvCa8784W32e3nz6drWERCxgAAAAFiS0dEAIgFHUgAAAAHdElNRQflBgoJJAHjnt/qAAAAXElEQVQYV2NkAANGBADzuRkZRUGcf8wQAT5GKWQVAoxKCC5IQIhRB0VAhNEMmc8oxuiIwmeUYPRFFZCKQuUzSmegCciUoQnItqAJyE1CE5BfgCagsA5NQHEPKh8ABksI4I813igAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDYtMTBUMDk6MzQ6MzkrMDA6MDANRUzBAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTA2LTEwVDA5OjM0OjM5KzAwOjAwfBj0fQAAAABJRU5ErkJggg==",
  		url: "https://ddl-warez.cc/?s=tt{{IMDB_ID}}&cat=0",
  		noResultsMatcher: "No search results",
  		category: "filehoster"
  	},
  	{
  		id: "prijevodi",
  		title: "Prijevodi-Online",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEU8WXhCX35FYoFKY31OZ4FRaoVWcIpbdI9geZRnfZNsgph1i6J3jaR8j6CBkKiBlKaSnrGMoLGhq7urtMKyvMq5ws7Ey9TL0tvR2OHd4uTl6uzt8vTz9vn3+vb3+/7///87YcDtAAAAp0lEQVQYV03P2xKDIAwE0AABBWwRq+AFm///yybamXYfD+ywgIt3jA4pxcHDg+5sTzfuRBXiF+gM4OoFbRqGwlK1stsq0AE4vn10Rg1FKlEZtXInKrRZIAHExp1iEL1AmUqjkzu9Qft7hah5jfgPm0XsBI5lv2BUiElgx76295Y1aj8LtADog+NztcgwGYJaG9Qq83T53IsHcPxCtIIvnOyd7dNcS5k+4y8R+zbzdgYAAAAASUVORK5CYII=",
  		url: "https://www.prijevodi-online.org/trazi?q={{IMDB_TITLE}}",
  		category: "subtitles"
  	},
  	{
  		id: "titlovi",
  		title: "titlovi",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAAALBAMMBgQTDgwWEhEYFBMfGxohHRwjHx4nIyIpJSQwLCtAPDpDPz5GQkFKRkVRTUtaVlVhXFtmYmF/enmBfHuIg4KLhoWOiYiYlZminZyoo6Kzrqy5tLPz8PX///+RInXYAAAAeElEQVQY043PUQ+CMAwE4JvLGIPRotaK4uT//0s3owsSHvwer5dLinYDO4Ffa9FZVCYED3tKj4+kNjcwLVVCDpqeiWI/EBHHrjSu+TTj+a7c4eFGVWWIFmQDHIvINF+kOJsGuC0rR5tHh1jx6BGcOXwZkzf+ee7XC9WYDLcu6ruMAAAAAElFTkSuQmCC",
  		url: "https://titlovi.com/titlovi/?prijevod=tt{{IMDB_ID}}&sort=4",
  		noResultsMatcher: "Našli smo <b>0</b> rezultata.",
  		category: "subtitles"
  	},
  	{
  		id: "torrentgalaxy",
  		title: "TorrentGalaxy",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADXklEQVQ4y22Ty28bVRyFz+/eeflt51U7TqipHZqWhAopKkJBsKG8hFhABX9AF4gNUmEBG5BYVEJiU4kVG1ZIqN2URiwKQgIhtRFNQEDTNMJukhIHJ47tsWdsj8cz914WEFQQ3/470tHRIdzHVvUh5lg21yrTmiI9yJ5oCQ4NtW2LlGOY4dEdEdUMkUBcZnNrCgDoUF6vlLSuqxLJncIjSpD0Cn9smOmhTiDmB2pgbEznNaHne2N7P7NcuzluJYf5qTVFAHB7Y4a3nXBstFp6TYWs0BzduTKZZqWEMJ4iRZbHg9Xq0FuO7U4vWjCz7fHqJ2zC3V44ue3T1tYJ2m44qbHd0lnLS75Z1asXJ3J+egqxt7likwAgSfVs8j+91eh+Xewdf4tpsrx3pHwhkcEuu9dwdd7IFCOD5BtDFXZsrdUZUdazhzIAMEWxhNSfM0yZdGXvjh5ar8RaRxZrTjfC9tqeFetlHudSmx+q4CAQUkAiif9AiuIkSPfgH5CidMSPn/HaPM16NkW10JwlkM6ImNsXbmsQrCtA0H0BThBW9jt+XSPGCcS51Eqya2RY11WaFMoEAIP0rKH04c3fO0v3nP61figaAyE7+31/5cfdzmftbliPUWQKAJSCNvCUztqdMPRE0AIAA/qx6chIfrPW+/XSD/WPrq7V3/vydv39Syv7HyyvO9/mk4lIlKxTBCCQwrZ7/oDZLTlo+O5vQgmHKz4+gbEXFhaihuMGt774xr5y+avm5Y2yt3zqMdYv6LkndWmcUIDqhP07e7bn0LnXU9ZcKfXo09mTF5M8elqS7PRj7Y/9ifqSYtIFoIhg8mbmdLw9/i6XWnGowtqKXTn/fXnnGp15JsFKD1PuxeOz52YTk+9wYlFFqid5uEmkun/VhUmCP8AkHwegdgetz5furl3YrAQVAoCzryajM8XI3PPHZs9PRUde5sQM/A8SSrb87vJ31fKHq+XG9ZvX/TYBwPy8xR4saemZQmzuicLRl6biqUVT08YIxP521VAIp+65P61Uq1d/2Wyt1nbUwY0bvfCfqYtFk2fzPJHKYCI7auXSMSPFOWkAICVkdxC4taa3bzflXrOuOuvrg+BfbwQAIrB0mmvxODN1EzrjIAIgJFQ4RNjvyaFty6EQSh46fwJKXa69yBEZmwAAAABJRU5ErkJggg==",
  		url: "https://torrentgalaxy.to/torrents.php?search=tt{{IMDB_ID}}",
  		noResultsMatcher: "Sorry. No results found...",
  		category: "pub_tracker"
  	},
  	{
  		id: "subdivx",
  		title: "Subdivx",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACMklEQVQ4jWWT224bOQyGSc1MBnn/FwqaRU6147ODxLZGEiWhdR/i64WmLnb3QhcCCZL/SVQ7ROT22r+ncyMiPaqKulZzOiIy4DpBVOg6RdQJ0Y7U645zfKRcF6S65BLfiHmFj2umtKT8OBDSniltiHlDridEHCLimOKRyV7I1yd8/kYsC6zuCGlP+XHA6oaTf2WyBd4eKb+eCbZGZUCcc1j54uvyQvm5JaQ9qoJIP5/8F16pHp9e8fmBVNbzBSpYPZDqiktY0g8yFxyqgqowjveIjDgdyfWTS3wi2JphGBFVIeVPrO6IdmhkuR51QspHgm0RJ9yNDhEhpA+Cvc+9Dum7e07nPTGvCLalH2RWwOE6IeUPztPMiW2JeUUs74S0b9DUCVY3hPpAqP+0jeIQGZqMcofrBJ++k+oSn56J5Y1Utk1edUIqW2J5w6fnuek7rhNU7hDp52GOYNu2pD5gdfPHH0JIe2J5v8GwuuM8LUj5o5lGHJ0b6Qe5wTid9/TdffNBtAPB3gnpA5GZMNeaUz6irhErIkQ7YHVHyp9N7mEYCbbmEp/I9XPWfmQc728y/pG1H4RLWJLqCqsHRKVdkMoanx/w6ZVS/b/M0wb2qDao5eeWr8sLVr5wziEqA8HWlF/PeHtksgUn/4rVzc3/VnfEssDnb+TrE5O9MMXj3yzkeiLmDVPa3Pw/pSU+rol5xSW+keqScl1wjo/U645ojRtpkZSZ7eHmf3WCqv4n2v+P/m99ZWUF+mNjOAAAAABJRU5ErkJggg==",
  		url: "https://www.subdivx.com/index.php?accion=5&masdesc=&buscar2={{IMDB_TITLE}}%20{{IMDB_YEAR}}&oxfecha=2",
  		noResultsMatcher: "No encontramos resultados con el buscador de subdivx. Probemos con el de Google.",
  		category: "subtitles"
  	},
  	{
  		id: "argenteam",
  		title: "aRGENTeaM",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE/0lEQVRYhe2UW0wUVxzGp22aJh1rVcBVlp3dZXcWS9eNWmkftAUvXbU8WCON0sgtNdrYikapVbyUWFbA8QJGEy+gsrBXll1YlEirtdAqQr12WhNj1dRUY2mxtj3AsrNzvj4sWhESl5emD3zJl3Myycz3ze8/ZxhmWMMa1v9RBQUFz/rWL86+sWq0iDJOhFcvooEXUcuLcE8Q4TaJsidJpC6TKD1c3UkidSaKknemKHlni5LXLEoN80X5yw8qepvXvTKkAtY8M/v1uuQusnEkbmyMwc2yWHRWcAjatIBHD9QbgOMJQOOEsI8bgGMJgD8BqE0AdfKQbYmQPdNA/fNATyzuDNVOf7+7IVMZUYEmIY+9Zv3kty+ELPJR+hySNf8tkjl3EklP0ZDMGUqybOZYkjtrFNmYOooIaS+TQzkxHUeWxlD3ynH4uVQN+HhQpw7UpgG1qYHqOFDnBIQ8U9MjpnClycoKQh5rzshgzWYzazKZWIVCwTKMgmUYhlUwDGtiGNasYNg1a3LfiXppRGDLjBF4IHBAjR5w6EHtOsChB+zxoK5X0eubHnmBoWjnhhW+5hWxgKACPaQFdYXDH9mmBq1Nao14BEPR1fMt4y8WL2jFthhI2znI1TrgsQIPScgOg2vID7/XJLD3rBlhN+X1WWDvNVnDvmJlb7f4sn8RktG7NQbBHRyomwd16PoTcBgQOvGuLeLgLkvsFFL6RlF37XIS9KSRkP89IjcuIdKJpUQ6uZqEvlpL5OZPSahlE3ngye7pLOLQVaKEdEALOP+df5iADtSmJ3+654yJKLwxPTo5uI17ECgZD7lKCVqr6bMa1MOBelSgNXEIORSQHEqgTg00GEBredAavv+b91l2JtK7B2JffGq4YGLYk0ui/4KgQqgiPnzefQZQL99vRV0izgiT7/tXjnR9vmC0VJw2Bpc3K0Fd/EACdg2kY6mnrzfOeyESAM/8mKvokndyoE49aF/o44ZXj1D9pMCpyoLXGYZhFCOfJ7tTR6HDEhe+58n527WQ3Ka5EeG/9HF0yt+FcQFpjzoc6BuEgFeD4KnFYBiGKc1fXXltvRrYyQH7NIBT3+/Lh10L6p6IUF1KWkQF2pdF+wPb4iCXa4G6QdD7eMCjAjm7ocjtdj/XunlOvWQZB6mYg3xQO7BAtQqyf3Z3T/uu5KeGn82MUt5aN641WKKCbNOB1vGD4I9HsD4J992zJ37vK3vt5va5Us9nUegt4SBXxQ/AD1scumrmfXen6fCiu/7ShXftWxb+6ilc2Fm/4+0BBc7kRM3v2BQLeY8atIYfnECdHj0uE/4o1jTft8S2/F6kR3exEtIe9RPo9Y/mH6iciK5KM3qqZqL76JsIVKcgYJ91e0CBq6vGbu8pDP9K0WAA6nnAz4f3fh7w64F6HVCnBXwawMsBPhXgUwMeDnCqALsKcKiAGg5wc4BLBbiVgHMs4FQAtmigajxQrb41oMAPuQoiCyrSUcqRO3s5cn23ll4uVtNzW+NIa6GeXBAmkwu7p5G2XcnkXKmZnN+fRi4dySTtFTmkrTyHtB3MJm37s8Prw2uHwvv2wznk24PZpLVyLbnpyDpNqqbkDChwcfmYxF6LyviTRWW8UjDaKB7Nyv1mb0auNWOE0fqhzujNm2r05puNzvxUozV/kdFryTV6ywqMzjJLRLYKBUZrebnxnD1fEdGJGNawhvVf6R8Sn+8pLq1sXwAAAABJRU5ErkJggg==",
  		url: "http://www.argenteam.net/search/{{IMDB_TITLE}}%20{{IMDB_YEAR}}",
  		noResultsMatcher: "No se encontraron coincidencias",
  		category: "subtitles"
  	},
  	{
  		id: "yggtorrent",
  		title: "Yggtorrent",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB+UlEQVQ4y+2RT0sUYQCHn/edcWfbP+666WoDtqTuqrhkqIERXQoiJIo6lR2yYwV9hI59g+gSRBFEh+jsoTQtzX9UkOUhtTzs5trq7OyuujO783YIhKIvEPQcfzw8lx/884g/h6cVT+56oFAoBUL8kjwFhoRhv+b9NXBz5Vt3VchLruumEEJKTduTlFIIBAg8TYhlXXlP7rYlFvcC11e/9JUs+2HmzVS6IZ2mYllYn5eobm+jB4PUBQI4tg2APxbDPH5sKRgKXr3XnpzV85v58J3s2rWidDszUxNkJ8cpr+dYezVJ+9BpUIqV0RccONpP9NBBNj4uEevr6tL86sbtyZcLsmgVTp4Jh5Oazy2krpwnMzODY1uYA0cItDQRaG7Cq9XwxyKEWk2EBKl2nEFNN2+l0r369If349Nd0ZGqrDYaDT6MSJjU8FmC8f2sPBulmFkn3p3E2KeTm50DodDYsaVwfuRLtiYvX7hY2CrmxzRRcb+/fksgHsU81Us5l8Upl0FCpM2kUipRdRzi/Z3Iehmd2Fpd6GzvmNMBrPlPD+oPJxqbehIjzQMdMc2PME/0EGqJoBk+QokWil+zeI5LpKN107Psx8XFtfu/3dg3fK6udWiwTQ8aZs2tSiElut+HUopaxUEzfAghvN2NQjY79m55/tFzl/8A8BNRncPzQBICSgAAAABJRU5ErkJggg==",
  		url: "https://www3.yggtorrent.re/engine/search?name={{IMDB_TITLE}}%20{{IMDB_YEAR}}&description=&file=&uploader=&category=2145&sub_category=all&do=search",
  		noResultsMatcher: "Aucun résultat",
  		category: "pub_tracker"
  	},
  	{
  		id: "fmovies",
  		title: "FMovies",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiElEQVQ4y4WTO0vDUBTHO4i6i9KHUAcf4Obq4qC4dCg4ip/A3a8ggoOgoJOLr8FCEdtSEQoO2icqaBXFKlRrH7a19JFgC/X4PyGRkCbphR9J7r3nd869nFgsquHwR3vBHDgAadAELZABx8AF+i16AwuDYB2UABlQAdvArg22yhl+eaPdWKDgBw4luE+2SovDYDwYk95t5pIdjmWBWy5NyjwajNNe6p3WkimaOk+Q1Rcxqohj3CzwKpO8ceIsTtF8iX5EgWK5L1pOPNIYKmKRjsTLgpxWEM4XIRAlKvU6naY/aeHyjpyBDkGOBW0jgSAIJIIm3gvVKq3cPGmP0+4q4GexVqOj1w+avbjVFWT1BC0E1hsNCmXytBRJ0kggRjZfxxGyLPBoBVe4vIdiGSU/0yS+DS6Q8Vjk9vxWJp3ItBi+p+nQNTJGzJqKY1xKI22qFzmjrXs3bvG/o3TjEDhUX6gJ3O4n3P7a/2EArIKCSXAZbHQEqyQ9YAbsghfQACJ4A/tg/r9sefwB9ZddWxDeLAcAAAAASUVORK5CYII=",
  		url: "https://fmovieshq.to/search/{{IMDB_TITLE}}",
  		category: "streaming"
  	},
  	{
  		id: "Flixtor",
  		title: "flixtor",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAp0lEQVQ4y52S3Q3EIAyD2YUBOkYHKLdMpmCbU7bow43QHfrYBsmRrOsfKZIlQHyGOKT0MD7f32RaTGrKKTIMGAFvUH0DN80wkDdwMQ0oQaJwq18At/2KtWCee+AVz3cTpUy0F97IZKBMlgi8Yr/wWe6zB9YLj36793mmtM/g6QDDQP9q5KDuYRjkk/a4yT188Q+E0i4hmAw8kxgMg0qZxGDKRL2tT+d3UYeBxHyLOHEAAAAASUVORK5CYII=",
  		url: "https://flixtor.to/browse?c=movie&m=filter&keyword={{IMDB_TITLE}}",
  		category: "streaming"
  	},
  	{
  		id: "privatehd",
  		title: "PrivateHD",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAM1BMVEVAAAAAAAA3JwAvKxY7MhJpVRCJbQKAdUGkjCqxjg+tl0q6mBvEnQi2nULesgvVsjHfwl+tmDNGAAAAAXRSTlMAQObYZgAAAGZJREFUGFdlz4sKwCAIBVCrVXOW9v9fu5uMvbog5aFAiYjCHZp52ov+8O0hIVUcNVXPBjgGYPTh6YBuABPbc84mADFmBhR4axNUBKUvwE2bMr44sAOrhwFxvi2xeGJYB1tGX+G3/gk23wQeQ8o1ZAAAAABJRU5ErkJggg==",
  		url: "https://privatehd.to/movies?imdb={{IMDB_ID}}",
  		noAccessMatcher: "Login to PrivateHD",
  		category: "priv_tracker"
  	},
  	{
  		id: "30nama",
  		title: "30nama",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALLSURBVDhPXVNdSJNRGH53vm/fNvmmmzRpStGilT84WuW8MxApyCKquyTC1g8Fid1EF9pFdhGBEUYEJUWMIiGLCO/CUulmGsZA+3E4xbbPi+bGNje/n332ntM3UB84nHOe8z7vOe9zzjHBFgz6/dXbBaEzqmmtkqJ4KOcWhNgenh9dVpQXF6enEyzQwMYE5H0gcGusUOj9lMtZs7pu0P9hJwTaRHHtsM3WdyocvocUCyglIK8CgdDTVOrsgqIYFADP86zXNI31FLsEAS47na87wuFzONU5Sg43N/c8TqW6Fg0xwd3a249Bd3c3tLS0sPn8fAzW19chXSxCVFUbH3q9xaF4fNz0vKFhx3dC5j5kMhYqrq+rgwvBIPh8jSxZOp0GSZKgUChAKBSCmZlZxp8sL5f367qXuEQxiDUzMcF2vLoadE2FaDQKsiyDw+GAOkxqxaPTtVLNVEO13IGqqrtf8/mdBg+HclnwzP6AFNa/YjKBjmb++fwF7G+GoP5vEt5lMqBhKSq23YJg5vwuV9+MLNsNPUzm8zC7ugpNCQmSkQhI4xMgYj+wvAx+mw1GslmWgMJjNvMEh5vewn08Jg3sRUEtmtqAZfTg+Bf2W0G1xMXzi8ac4TYGi+j6o5oaoJdIs5d23IptqCW1gjBqRUEJpysqYATrvIOJNsqq0BMaVzSS0fE+1HJtbvcCTq7NKQp7E04MvOFyAY8GetB5Gu7kOOisrITBZBJixls5Koqqg+OCJDg1Nd9aVvbAbTazhbFcDq7H40xInV7DRseUm0BzKWgs1VAtM/AggLmrqWn4SSp1QlJVFkRBT0Gx0QMqvup0fhyYnDzzDfdgx5bwTS8lEm9ver1WzmRqXlJVUkSe/pbSl7JgsiN2u9ZRUdHfHw5foWLKb7pCipc+3167zXbppyy3rug6+86VhMRqLZbRbKHw7Hwk8psFMgD8A0gOJK1Z8ITcAAAAAElFTkSuQmCC",
  		url: "https://30nama.com/search?q=tt{{IMDB_ID}}",
  		category: "movie_site"
  	},
  	{
  		id: "idope",
  		title: "iDope",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABaklEQVQ4y4WSP0vEMBiHq6cnipMiuoo4KAgO7eTWDn4BR3ERxEUEFzcXv4CDg5MOgl/A7SZBOHVxEMHhxMM/qC0Koiii3tUnTRpyob0GHt40TX7v730TJwq8WajDSxi4K8RO2IYHuIdLOAwDb5U44tgjCtwbfsQcjolfMAoVsRb5FoH3DMtQMgXepECy4RemEKuo7yzEng0twsZ1Pr4R+oMD5l2wA4+Kd7I3lAOJ7wqRhdRBmYzTLMxAr1zzytAvcQeJc1CznNzCgBA4Z3ItwM0ZdDsZg/9jcGcINGHewU6se+CLUrweJ2dE8iaahsiuIZDEtgIkmVBNTAWOtICiyMG4FNBnjlsFCktwF60S9lsEwjYOWB+CK+M6hdBSVg/6mJcE4rEIQXXFVesan2DY7kEDTnBSDeWBUzLW4Md60mLfWlpX3pPNQ1jf06UmDnzdxLhA8AM2Q/ViU4FXowdZfMIFbMEkCTrM5v4DlJi232TMcc0AAAAASUVORK5CYII=",
  		url: "https://idope.se/torrent-list/{{IMDB_TITLE}}/",
  		noResultsMatcher: "We cannot find",
  		category: "pub_tracker"
  	},
  	{
  		id: "solidtorrents",
  		title: "SolidTorrents",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABS0lEQVQ4y43TPShFYRzH8evIS3kdbnEzIAkpg7fBIJNsClnEZjHcwqDMBgaDGNzFwGQwYFE3b5PZYkLeSillwEDX8f3XTx7XufeeU5/uuc//pf/znHMikYDrJtachzK0Yho1kbAXyfkYwg66cIIz9IVt0Ihr+JjDBD7xgMFcxZ1ox7YaXKBDU/hq3J2puBJHWEM/XlQ0j3F86P8uSoMa1OIST+jFCo6xigacqsH7v62wUIBqLOALUyhCsf0qx51iA57bIIZl9CCBqgxbTKrBOaJusAW3GEN5lkOeVINHNLmBNh3aISqyNBjQNp6txg3UaQILjoaYwHLr3YAd1p6CyT/7+82JakLL2bea9IRhvCKFTZ1Lodj9lmJvGAkazx7bovOo7nAg91qz2NLPow1qUoIZvVApFfm6v8Ks5eT6HjyNHMe63ou41rz0/G9JyvyKqEKulQAAAABJRU5ErkJggg==",
  		url: "https://solidtorrent.to/search?q={{IMDB_TITLE}}",
  		noResultsMatcher: "Found <b>0</b>",
  		category: "pub_tracker"
  	},
  	{
  		id: "bitsearch",
  		title: "BitSearch",
  		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACGUlEQVQ4y33Tz2vTcBgG8Kz+CSLCmP9CfjgPKsh06JSBYyjqCkKZ2ClqnbNDNmZ14MEhDNTLpJu4g8yDKExE5kUdqKcxFKUqCPbSNN/Qua7purRIH59ktqQh9YX3lLyfJN/3iST5KqJmt/Wr2fhZVX91XtO/XdD07zFNX7iiZa5d1TLbpWZ1UjFawqoxeFrNWkRwhh1VdRDBRfZlNpH1OKFhLdPSMNzL4eOK8YAIwhwkgmbIkJYBkVkioTrQo4gYERCBF3l6v4CfnyuYHFgJQkbc4SOK2NqtiMJRRcCLRDsEUIVbP5bKQZ9T4pm0SodkMXiYw0TgRU5pBlIcdCqn/0G0PfBMxqRO2XxxUBZwkJ52gYl4HrFjuU1ENXCu08T0eB6Lz0uI8a28CLfzRuqQza8HZBMOMjdddJ9ob1QxdWsNd0fz+Ph6A/17BJ5NWe61lzOWF/kl7ZPNFBE4yNzMuntTpVzFw0kLydsFLL+3EdlL/N4mMJ+0vNtJO8ACGw7StcvExNgaLvWt1M+kb7fAnaFVzD8qYmC/aFgxw/bOAUYcoIbUPqd7p8CXpYr7VJOHeEJrXLGDMLEJB2hll/xIuCuHWi1/KCMgJzaRNjcLHBytAV7kcbKI1KcKhiO/4c8JY5+oJ5FDIfZsEFJbsS8nT4iEGv6Hf8h1tv0fxCZyg8iWpn8lB3ewb7IX2WkiaYbtLRObYOzb/Pf/BcAPLnFvp7oYAAAAAElFTkSuQmCC",
  		url: "https://bitsearch.to/search?q={{IMDB_TITLE}}",
  		noResultsMatcher: "Found <b>0</b>",
  		category: "pub_tracker"
  	}
  ];

  const DESCRIPTION = description;
  const HOMEPAGE = homepage;
  const NAME_VERSION = `Link 'em all! v${version}`;
  const GM_CONFIG_KEY = 'config';
  const GREASYFORK_URL = 'https://greasyfork.org/scripts/17154-imdb-link-em-all';
  const CONTAINER_ID = '__LTA__';
  const DEFAULT_CONFIG = {
    enabled_sites: [],
    fetch_results: true,
    first_run: false,
    open_blank: true,
    show_category_captions: true
  };
  const CATEGORIES = {
    search: 'Search',
    movie_site: 'Movie sites',
    pub_tracker: 'Public trackers',
    priv_tracker: 'Private trackers',
    streaming: 'Streaming',
    filehoster: 'Filehosters',
    subtitles: 'Subtitles',
    tv: 'TV'
  };
  const FETCH_STATE = {
    LOADING: 0,
    NO_RESULTS: 1,
    RESULTS_FOUND: 2,
    NO_ACCESS: 3,
    TIMEOUT: 4,
    ERROR: 5
  };

  var img$8 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAABkklEQVQoz1VRTUsCYRBe/AHe/Qn+j710EbKLVJcyiAqLLkWJkdkSUdChOpQRRWVRG6RQUqirtq7pupZRUvRxyOIlIU9ed5+mbSFjDjPvzDPPM+8MB+7PVG9ekiXJ25qzXMVZtqu2fP0D7xDrZ7aY/djZAqiEy3qRKY4se8ULYizqENm+vhO2ADf+Z3zhCdlmyqjiDieG2FTBEMeC3wQUA7LxTIVHAlVNfwsVV5gwRgOWRE64QwkFXGAD28hCQYb65wVT4kqTa+nGAzQkMKOM81P8knJJIA2LjblaSONk/ZOICyhjD7P8T886L0ImNoUGHtI5SX8jTYU6olg2Aav8ATHEkaZ8j87taEu1rcY1QUrYVNb4FZLIkNw5+hqeWodmDikKORorhzwOsU9RCqcUDQjWHo4CEeOeyioqNEuemHJI0mvY6P/95q4/gVdEEGoKhkzqPmO4GSH9abj91h6C4RG9j405Qkwlhl7W6fAwl94WbjnWiHPQPmkL1pOIoaveaeu2u5z/rvlrPq9Hapfc/879DQmIXQjyme6GAAAAAElFTkSuQmCC";

  var img$7 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIsSURBVDjLpVNLSJQBEP7+h6uu62vLVAJDW1KQTMrINQ1vPQzq1GOpa9EppGOHLh0kCEKL7JBEhVCHihAsESyJiE4FWShGRmauu7KYiv6Pma+DGoFrBQ7MzGFmPr5vmDFIYj1mr1WYfrHPovA9VVOqbC7e/1rS9ZlrAVDYHig5WB0oPtBI0TNrUiC5yhP9jeF4X8NPcWfopoY48XT39PjjXeF0vWkZqOjd7LJYrmGasHPCCJbHwhS9/F8M4s8baid764Xi0Ilfp5voorpJfn2wwx/r3l77TwZUvR+qajXVn8PnvocYfXYH6k2ioOaCpaIdf11ivDcayyiMVudsOYqFb60gARJYHG9DbqQFmSVNjaO3K2NpAeK90ZCqtgcrjkP9aUCXp0moetDFEeRXnYCKXhm+uTW0CkBFu4JlxzZkFlbASz4CQGQVBFeEwZm8geyiMuRVntzsL3oXV+YMkvjRsydC1U+lhwZsWXgHb+oWVAEzIwvzyVlk5igsi7DymmHlHsFQR50rjl+981Jy1Fw6Gu0ObTtnU+cgs28AKgDiy+Awpj5OACBAhZ/qh2HOo6i+NeA73jUAML4/qWux8mt6NjW1w599CS9xb0mSEqQBEDAtwqALUmBaG5FV3oYPnTHMjAwetlWksyByaukxQg2wQ9FlccaK/OXA3/uAEUDp3rNIDQ1ctSk6kHh1/jRFoaL4M4snEMeD73gQx4M4PsT1IZ5AfYH68tZY7zv/ApRMY9mnuVMvAAAAAElFTkSuQmCC";

  var img$6 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKcSURBVDjLpZPLa9RXHMU/d0ysZEwmMQqZiTaP0agoaKGJUiwIxU0hUjtUQaIuXHSVbRVc+R8ICj5WvrCldJquhVqalIbOohuZxjDVxDSP0RgzyST9zdzvvffrQkh8tBs9yy9fPhw45xhV5X1U8+Yhc3U0LcEdVxdOVq20OA0ooQjhpnfhzuDZTx6++m9edfDFlZGMtXKxI6HJnrZGGtauAWAhcgwVnnB/enkGo/25859l3wIcvpzP2EhuHNpWF9/dWs/UnKW4EOGDkqhbQyqxjsKzMgM/P1ymhlO5C4ezK4DeS/c7RdzQoa3x1PaWenJjJZwT9rQ1gSp/js1jYoZdyfX8M1/mp7uFaTR8mrt29FEMQILr62jQ1I5kA8OF59jIItVA78dJertTiBNs1ZKfLNG+MUHX1oaURtIHEAOw3p/Y197MWHEJEUGCxwfHj8MTZIcnsGKxzrIURYzPLnJgbxvG2hMrKdjItjbV11CYKeG8R7ygIdB3sBMFhkem0RAAQ3Fuka7UZtRHrasOqhYNilOwrkrwnhCU/ON5/q04vHV48ThxOCuoAbxnBQB+am65QnO8FqMxNCjBe14mpHhxBBGCWBLxD3iyWMaYMLUKsO7WYH6Stk1xCAGccmR/Ozs/bKJuXS39R/YgIjgROloSDA39Deit1SZWotsjD8pfp5ONqZ6uTfyWn+T7X0f59t5fqDhUA4ry0fYtjJcWeZQvTBu4/VqRuk9/l9Fy5cbnX+6Od26s58HjWWaflwkusKGxjm1bmhkvLXHvh1+WMbWncgPfZN+qcvex6xnUXkzvSiYP7EvTvH4toDxdqDD4+ygT+cKMMbH+3MCZ7H9uAaDnqytpVX8cDScJlRY0YIwpAjcNcuePgXP/P6Z30QuoP4J7WbYhuQAAAABJRU5ErkJggg==";

  var img$5 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ/SURBVDjLbVJBaxNBGH2bpEkTmxi1NTRKTZtoQUHEWz0Igj2I4kG9eVNQhEBO7bEHc+yv8JAiHnr2B4gFqVrQRhObljQolBSTJqZJdnZmfbNr2rU68DEz33zfm/fejGHbNrxjaWlpRCk1J6WcYZxkgPGTsWJZ1mIul/vlrTe8AIVC4Qqbl5PJ5GQsFoPP5wP36PV6qNfr2OIg0L35+fm1fwDYPMLDj+l0OmOaJmq1Gjqdjr4dgUAAiUTCqSsWixvMXV5YWOjqvW+AxOSz8fHxjBAC5XJ5s91up7gO6tDrUqn0QwOTXYZSsoO+wGDB5EwkEkGlUgGb7mSz2apHajWfz9+sVqvFVCrl1P4PYExr5m16vYUjQ+c0O11DtmN/ebD95pG9UpnGzl7Y0Xz30ir8toAtLdiWG0JIvFi76piaGG7g9plVTD/5YLgMCPLg/g0YtMTwhznfApRBfsP6kAYJSKuN57Md5oXTsvHy7aEEfZMutHZfIRAahWGMsHAICMeZVsD+HmTrG8zudyhrH+HJLGyz7wEgRSh9k4nm+nvqPIb4xWuovV5k/2lMXJ9F8+s6ARqIpk6QsIQtTC+AcGTYpBqfvgBfcJTuKMi+xKfdMCZgIp6eRK8TYu2+w2oA4PwDm+5qVK218XmNLN7xxILqKfS7pGqTWekLmuVtV65STs8hA73RqJQQP5+CP3KKACamHj7FlGBDawfH00kEW0MuA8o9AmA6qMrSHqwTIAoM08hAkHkN0ES3UYfotBGdiNFu5cr2AmgJobOPET7nhxEMuU/o40soSjO7iHbbVNgnUen6pY0/AOCTbC7PuV44H0f8Cetg5g9zP5aU7loDcfwGcrKyzYdvwUUAAAAASUVORK5CYII=";

  var img$4 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGrSURBVDjLvZPZLkNhFIV75zjvYm7VGFNCqoZUJ+roKUUpjRuqp61Wq0NKDMelGGqOxBSUIBKXWtWGZxAvobr8lWjChRgSF//dv9be+9trCwAI/vIE/26gXmviW5bqnb8yUK028qZjPfoPWEj4Ku5HBspgAz941IXZeze8N1bottSo8BTZviVWrEh546EO03EXpuJOdG63otJbjBKHkEp/Ml6yNYYzpuezWL4s5VMtT8acCMQcb5XL3eJE8VgBlR7BeMGW9Z4yT9y1CeyucuhdTGDxfftaBO7G4L+zg91UocxVmCiy51NpiP3n2treUPujL8xhOjYOzZYsQWANyRYlU4Y9Br6oHd5bDh0bCpSOixJiWx71YY09J5pM/WEbzFcDmHvwwBu2wnikg+lEj4mwBe5bC5h1OUqcwpdC60dxegRmR06TyjCF9G9z+qM2uCJmuMJmaNZaUrCSIi6X+jJIBBYtW5Cge7cd7sgoHDfDaAvKQGAlRZYc6ltJlMxX03UzlaRlBdQrzSCwksLRbOpHUSb7pcsnxCCwngvM2Rm/ugUCi84fycr4l2t8Bb6iqTxSCgNIAAAAAElFTkSuQmCC";

  var img$3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALnSURBVDjLpZNbSNNxFMcN9b3opZce7CHqIagegqAgLB+NyMIMFCRBSX3wPm+Z1ZZZlhpT03ReZs7ZvKDpps7LmKa2uTbTnO7inM3L5vxvc3P+1X37zYeVGBF04Mvvxzmcz+/8Duf4AfD7Hx1yDPIKg0dbHonlnYz1r8JsWt6VRUubk1ZE1Unt7e+yLv8VIOGzylS9jG2jegxry1rYbFZQlAVLCyqopDwI38duNr9JyP0jYIjHLNHIymE1G6A2WPFxQI8ywTRK+d/Q0KPB5NwK9OpRdFfFgcOMSTsAEDUUXJF1ptKWVT0kChNaB/XQGG2w2Bww2zahXrShoVeDtmEdZhU94D6956xiPbzgA/TXZXTPk8D3hXXwxTp4zUpRmPuxjC1y98rhASq6NJAqDejjpqAiJ6LBBxioT1w2GabAFc1jhrzs3PHA4XSCXcPBKgHZ3W4IRAOQzFF42aTE1EQzqrLD9D6AuC5hy2pZQmGjEqsuGlb3HrZJIPNxPritHcjIy0fv6DimKBrJ7HEs6sdRk33H5QMIK2O3LGta5HMUWHTQBLIHI2XHs1dF+8kShQrmHUBmoZFY/BkG7TCqM8N+AQSvo3TaqR4U85UYnqdgIp822ml0D41At27Dyi6gamFjIPIM+oMD0R92HE2RZykfoJYZxRlqZmBUOYcCvhpm0jArDdj3iMh9vq0MqvSr2PpUBM+MEE5eMr7En/P0Xg9I3AdUP48/X/8k3DUrq0djjxwv+LNQ6DfgIP1wOGn0R5yCiySjNBTIOAawgmAuvAbRDX+db5Aq86MZHwruYmasDIMTMrA4Y0gvHUFKsXS/bI+8Fb/bRt4J4g/wHBhldk5kbiXjlqOj/D4mxUzoZrjQTdei7/ZRbFY/AEiSO90PViJDnD9EIf5Lh5aJnRt9qSQtrOlt8k1DeWqoyytBzEVqLOa0x5QRhLXMQGhjjkAcGrArDPHP+ue1lYafZJAX9d6yyWn0Jnv9PwH2GPv45gRecwAAAABJRU5ErkJggg==";

  var img$2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==";

  var img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMtSURBVDjLVZNLa1xlAIafc5szk8xkMkkm5MKY2EpT2qa2MTVCmoLS2gq6EKooimAW7iQb/0I2bgTRIog0oFW7KQpCS7VqrSmmJGlSQtswqWlLLmbGmcmcZM6cy/edz00r6bt8eXh4N6+mlGJnxiZHR4APgSNAFjCBKjClInXm05Gzl3by2mPB2OSoCUwAp1/LHbcziSyO24gbgJAegg2urF8UUsifhZBvfvXK99v/C8YmRy3gt8G2/cMv517E8Wx8ApYcjZiyKbkRSgQkcFn3rzG9Nn1LhOLYt2/8UNUfLZkYaN0zfLRrkLIMCHUNIXTqIoZLjLJvU/ASrFQtnko+z2BH38HAD78DMConHh4FPn5nz6vGgqyxTp16JNj2kpR9C8eD/OoW1VoNO1NCS+d5oW0vV27f2PX11MS8MTR6+JOTXUMHNCPBui5AtdMpk8xsGNQ9ndur20TxCnbPIn5TnmJUwaxIDrTm9Jn7d1tM4EiuqZs5d41iXGefsZsIwYNCgOfVSXconJbLLEWb4CuahU2+6HO8d4DQF/0m0NpgNvLAXaPgu6QadrEZpKhUItJZj/aMS1EewvHnsdUWW/+WKG82kEykCAPRbCqlNE1B4DsocpiW5OJfIVoiyfqSQFdNdGXrpLZGcFZDPKYJg2VQCiGEZkoRlZ3A6W41mknFn2WlaOKFFrG4Tbw9wb2/S3g3miHySLdbNDd2kzYKVGpVpIiqugjF7P3yQ55pyLFWmCSyVokZPqHnEoYmsWQGuyWOGdexNIkRFOnqbGN5bRngjh4G4rMLd6+KnmQW012lWrpOJuNjCh9LU9i6gRkEZHIrpNv/QK8vcijXz5lfLijgS+PmuYV75+fPDXr1Wt9znfsouy5x+2miuoltW1iawBJV0o0/wT8lBvbv5WZ+gaWNlasz43MfmQChH777e37uT78eHDx5+BiLBROjqhDaFmGkQ1KS6+mlr7+XX2evc+nWVB54+4kznfr8pZQIxXkRyhPvDb9vIjtQqgFN12hLO2yUZ/ni8o8SuAa8NTM+t/GE4HGGx4del0J+IGXUH8ko86iuAneAszPjc9/s5P8DuO6ZcsXuRqAAAAAASUVORK5CYII=";

  var img = "data:image/gif;base64,R0lGODlhEAAQAPUCAHR2dOTi5Pz6/PTy9MzKzNTW1Ly6vHx+fOTm5LSytHx6fLy+vPT29Nze3ISChIyOjOzq7JSWlJyenKSmpNTS1JSSlJyanNza3Pz+/MTGxOzu7KSipKyqrIyKjISGhLS2tMTCxMzOzKyurP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBQACACwAAAAAEAAQAAAFUaAgjsJ1kWgpXoBypsIGbGV7BlMwMi3AlK/JjCSjoXA60g+m3Eg0TGJLEo1EYtPqFSLZQKLHRRIcUNiODcxo0VscXTszXPMVYC7qnXiVAftFIQAh+QQJBQABACwAAAAADwAQAAAFUWAgjoEGkeioKYqWBouzlKzLZMLoAI5oihlFZhSboQS4l7JkMOSWMJ5h2TRIqc4mA6q6bKEMD+9LIl94QohEcgp/w+MKq+IrewMdNJdyOFBQIQAh+QQJBQAKACwAAAEADwAPAAAFSaAijkpVkWRhFaI5ImQEWKgSAMG71jbvv5TfC3AI+igFCtHIS9qYQtGgSYCMJDMU5LC0EXECgyH8JbSyCWICwS2+zllIlbojhQAAIfkECQUAEAAsAAABABAADwAABVMgJI6QYZDosAyiOTLoAiwoxBzwa7C1UP8/BAJoezwaCIVi+DMCjkpmzfmwSXvGAFEkCPhGMhpJ4PxCHM9WwfYEaFsOGuFJICvNJNnMih8nEjkkIQAh+QQJBQAGACwAAAEAEAAPAAAFV6AhjgZFiUMxkNiFiaYxOICzwsBFlnU+ti8WzbYrylS/oHHA4Qwwj4dyx6k5owKjoargyKY7plPL2hUihWLVO4p0URBZLwtDyxWBLYBdLNTSMmQtBGAGIQAh+QQJBQABACwBAAAADwAQAAAGVsCAUNh4PBrDZNIIeAQwGkxyIOw0OxhLU/oEUIudBqTpHVKV2a1yLYiu3xhQRvD5vIlNuf0Oyt/Nclx/aAZnSRlhQwYABkJtVU2AGl0KX4lsfoMBYm9BACH5BAkFAAQALAEAAAAPABAAAAZVQIJQOOBwBsMkYoEgbAAATpKogAY4UOnn8BEuoNHiBnmAUq3TbZfInLrf08uFEArB6db6/VKd39l/bxgXAm4XEn54iUMSUUMChF4bVItJHR2BRIVuQQAh+QQFBQABACwAAAAAEAAPAAAGWsCAcCgAgQTDZIBxYQRAAABIKWR4FB5mdPGshIYXrKJpRFYAFeI1qwx5k0UkNUlxjOdVTcAexWuwf1EOflEadQ4UeEt6io0DcwwLTmqPbQpccGAZVZKKIiJzQQA7";

  const iconSrcs = {
    cog: img$8,
    error: img$7,
    info: img$6,
    lock: img$5,
    tick: img$4,
    timeout: img$3,
    world: img$1,
    x: img$2,
    spinner: img
  };
  const Icon = ({
    className,
    title,
    type
  }) => preact.h("img", {
    alt: `${type} icon`,
    className: className,
    src: iconSrcs[type],
    title: title
  });

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z$6 = ".Options_options__5TB2e {\n  margin-top: 10px;\n}\n\n  .Options_options__5TB2e > label > span {\n    margin-left: 10px;\n}\n";
  var css$6 = {"options":"Options_options__5TB2e"};
  styleInject(css_248z$6);

  const Options = ({
    options
  }) => {
    const optionLabels = options.map(([key, title, val, setter]) => preact.h("label", {
      key: key
    }, preact.h("input", {
      checked: val,
      onInput: ev => setter(ev.target.checked),
      type: "checkbox"
    }), preact.h("span", null, title), preact.h("br", null)));
    return preact.h("div", {
      className: css$6.options
    }, optionLabels);
  };

  const SiteIcon = ({
    className,
    site,
    title
  }) => site.icon ? preact.h("img", {
    alt: site.title,
    className: className,
    src: site.icon,
    title: title
  }) : null;

  var css_248z$5 = ".Sites_searchBar__omy0k {\n  display: flex;\n  flex-direction: row;\n  margin-bottom: 1em;\n}\n\n  .Sites_searchBar__omy0k .Sites_searchInput__0o5oY {\n    background-color: rgba(255, 255, 255, 0.9);\n    border-radius: 3px;\n    border-top-color: #949494;\n    border: 1px solid #a6a6a6;\n    box-shadow: 0 1px 0 rgba(0, 0, 0, .07) inset;\n    display: flex;\n    flex-direction: row;\n    height: 24px;\n    line-height: normal;\n    outline: 0;\n    padding: 3px 7px;\n    transition: all 100ms linear;\n    width: 100%;\n}\n\n  .Sites_searchBar__omy0k .Sites_searchInput__0o5oY:focus-within {\n      background-color: #fff;\n      border-color: #e77600;\n      box-shadow: 0 0 2px 2px rgba(228, 121, 17, 0.25);\n}\n\n  .Sites_searchBar__omy0k .Sites_searchInput__0o5oY > * {\n      background-color: transparent;\n      border: none;\n      height: 16px;\n}\n\n  .Sites_searchBar__omy0k .Sites_searchInput__0o5oY > button {\n      margin: 0 0 0 0.7em;\n      padding: 0;\n}\n\n  .Sites_searchBar__omy0k .Sites_searchInput__0o5oY > input {\n      flex-grow: 1;\n      outline: none;\n      padding: 0 0 0 0.5em;\n}\n\n  .Sites_searchBar__omy0k .Sites_resultCount__xMc-y {\n    font-weight: bold;\n    margin-left: 2em;\n    min-width: 140px;\n    text-align: right;\n}\n\n  .Sites_searchBar__omy0k .Sites_resultCount__xMc-y > span {\n      color: black;\n}\n\n.Sites_siteList__4rCbT .Sites_catList__Fv8G0 {\n    display: flex;\n    flex-wrap: wrap;\n}\n\n.Sites_siteList__4rCbT .Sites_catList__Fv8G0 h4 {\n      width: 100%;\n}\n\n.Sites_siteList__4rCbT .Sites_catList__Fv8G0 label {\n      align-items: center;\n      color: #444;\n      display: flex;\n      flex-flow: row;\n      padding: 0 6px;\n      transition: color 100ms;\n      width: 25%;\n}\n\n.Sites_siteList__4rCbT .Sites_catList__Fv8G0 label:hover {\n        color: #222;\n}\n\n.Sites_siteList__4rCbT .Sites_catList__Fv8G0 label.Sites_checked__nqnSg span {\n        color: black;\n}\n\n.Sites_siteList__4rCbT .Sites_catList__Fv8G0 label .Sites_title__4rEy0 {\n        flex-grow: 1;\n        overflow: hidden;\n        text-overflow: ellipsis;\n}\n\n.Sites_siteList__4rCbT .Sites_catList__Fv8G0 label input {\n        margin-right: 4px;\n}\n\n.Sites_siteList__4rCbT .Sites_catList__Fv8G0 label .Sites_extraIcon__YYfVy {\n        height: 12px;\n        margin-left: 4px;\n        width: 12px;\n}\n\n.Sites_siteList__4rCbT .Sites_catList__Fv8G0 label .Sites_siteIcon__GRVSj {\n        flex-shrink: 0;\n        height: 16px;\n        margin-right: 6px;\n        width: 16px;\n}\n";
  var css$5 = {"searchBar":"Sites_searchBar__omy0k","searchInput":"Sites_searchInput__0o5oY","resultCount":"Sites_resultCount__xMc-y","siteList":"Sites_siteList__4rCbT","catList":"Sites_catList__Fv8G0","checked":"Sites_checked__nqnSg","title":"Sites_title__4rEy0","extraIcon":"Sites_extraIcon__YYfVy","siteIcon":"Sites_siteIcon__GRVSj"};
  styleInject(css_248z$5);

  const SearchInput = ({
    q,
    setQ
  }) => preact.h("div", {
    className: css$5.searchInput
  }, preact.h("span", null, "\uD83D\uDD0D"), preact.h("input", {
    onInput: e => {
      setQ(e.target.value.toLowerCase().trim());
    },
    placeholder: "Search",
    value: q
  }), preact.h("button", {
    style: {
      display: q.length ? 'unset' : 'none'
    },
    title: "Clear",
    type: "button",
    onClick: () => setQ('')
  }, preact.h(Icon, {
    type: "x"
  })));
  const DummyIcon = ({
    size
  }) => {
    const sizePx = `${size}px`;
    const style = {
      display: 'inline-block',
      height: sizePx,
      width: sizePx
    };
    return preact.h("div", {
      className: css$5.siteIcon,
      style: style
    });
  };
  const SiteLabel = ({
    checked,
    setEnabled,
    site
  }) => {
    const input = preact.h("input", {
      checked: checked,
      onInput: e => setEnabled(prev => e.target.checked ? [...prev, site.id] : prev.filter(id => id !== site.id)),
      type: "checkbox"
    });
    const icon = site.icon ? preact.h(SiteIcon, {
      className: css$5.siteIcon,
      site: site,
      title: site.title
    }) : preact.h(DummyIcon, {
      size: 16
    });
    const title = preact.h("span", {
      className: css$5.title,
      title: site.title
    }, site.title);
    const extraIcons = [site.noAccessMatcher ? preact.h(Icon, {
      className: css$5.extraIcon,
      title: "Access restricted",
      type: "lock"
    }) : null, site.noResultsMatcher ? preact.h(Icon, {
      className: css$5.extraIcon,
      title: "Site supports fetching of results",
      type: "tick"
    }) : null];
    return preact.h("label", {
      className: checked ? css$5.checked : null
    }, input, icon, " ", title, " ", extraIcons);
  };
  const CategoryList = ({
    enabled,
    name,
    setEnabled,
    sites
  }) => {
    const siteLabels = sites.map(site => preact.h(SiteLabel, {
      checked: enabled.includes(site.id),
      setEnabled: setEnabled,
      site: site
    }));
    return preact.h("div", {
      className: css$5.catList
    }, preact.h("h4", null, name, " ", preact.h("span", null, "(", sites.length, ")")), siteLabels);
  };
  const Sites = ({
    enabledSites,
    setEnabledSites,
    sites
  }) => {
    const [q, setQ] = hooks.useState('');
    const catSites = Object.keys(CATEGORIES).map(cat => {
      const s = sites.filter(site => site.category === cat);
      if (q.length) {
        return s.filter(site => site.title.toLowerCase().includes(q));
      }
      return s;
    });
    const cats = Object.entries(CATEGORIES).map(([cat, catName], i) => catSites[i].length ? preact.h(CategoryList, {
      enabled: enabledSites,
      key: cat,
      name: catName,
      setEnabled: setEnabledSites,
      sites: catSites[i]
    }) : null);
    const total = catSites.reduce((acc, s) => acc + s.length, 0);
    return preact.h(preact.Fragment, null, preact.h("div", {
      className: css$5.searchBar
    }, preact.h(SearchInput, {
      q: q,
      setQ: setQ
    }), preact.h("div", {
      className: css$5.resultCount
    }, "Showing ", preact.h("span", null, total), " sites.")), preact.h("div", {
      className: css$5.siteList
    }, cats));
  };

  var css_248z$4 = ".About_about__wuWQp {\n  padding: 1em 0;\n  position: relative;\n}\n\n  .About_about__wuWQp ul > li {\n    margin-bottom: 0;\n}\n\n  .About_about__wuWQp h2 {\n    font-size: 20px;\n    margin: 0.5em 0;\n}\n\n  .About_about__wuWQp > *:last-child {\n    margin-bottom: 0;\n}\n\n  .About_about__wuWQp .About_top__jQHYs {\n    text-align: center;\n}\n\n  .About_about__wuWQp .About_content__hReHO {\n    width: 61.8%;\n    margin: 0 auto;\n}\n";
  var css$4 = {"about":"About_about__wuWQp","top":"About_top__jQHYs","content":"About_content__hReHO"};
  styleInject(css_248z$4);

  const About = () => preact.h("div", {
    className: css$4.about
  }, preact.h("div", {
    className: css$4.top
  }, preact.h("h3", null, "\uD83C\uDFA5 ", NAME_VERSION), preact.h("p", null, DESCRIPTION)), preact.h("div", {
    className: css$4.content
  }, preact.h("h2", null, "\uD83D\uDD17 Links"), preact.h("ul", null, preact.h("li", null, preact.h("a", {
    target: "_blank",
    rel: "noreferrer",
    href: HOMEPAGE
  }, "GitHub")), preact.h("li", null, preact.h("a", {
    target: "_blank",
    rel: "noreferrer",
    href: GREASYFORK_URL
  }, "Greasy Fork"))), preact.h("h2", null, "\u2728 Contributions"), preact.h("p", null, "Add new sites or update existing entries."), preact.h("ul", null, preact.h("li", null, preact.h("a", {
    target: "_blank",
    rel: "noreferrer",
    href: "https://github.com/buzz/imdb-link-em-all/issues/new"
  }, "Open a GitHub issue"), ' ', "or"), preact.h("li", null, preact.h("a", {
    target: "_blank",
    rel: "noreferrer",
    href: "https://greasyfork.org/en/scripts/17154-imdb-link-em-all/feedback"
  }, "Give feedback"), ' ', "on Greasy Fork.")), preact.h("p", null, preact.h("em", null, "Thanks to all the contributors!"), " \uD83D\uDC4D"), preact.h("h2", null, "\u2696 License"), preact.h("p", null, "This script is licensed under the terms of the", ' ', preact.h("a", {
    target: "_blank",
    rel: "noreferrer",
    href: "https://github.com/buzz/imdb-link-em-all/blob/master/LICENSE"
  }, "GPL-2.0 License"), ".")));

  var css_248z$3 = ".Config_popover__qMfu9 {\n  background-color: #a5a5a5;\n  border-radius: 4px;\n  box-shadow: 0 0 2em rgba(0, 0, 0, 0.1);\n  color: #333;\n  display: block;\n  font-family: Verdana, Arial, sans-serif;\n  font-size: 11px;\n  left: calc(-800px + 35px);\n  line-height: 1.5rem;\n  padding: 10px;\n  position: absolute;\n  top: calc(20px + 8px);\n  white-space: nowrap;\n  width: 800px;\n  z-index: 100;\n}\n.Config_popover__qMfu9.Config_layout-reference__X38TI {\n    left: calc(-800px + 35px);\n}\n.Config_popover__qMfu9.Config_layout-reference__X38TI:before {\n      right: calc(35px - 2 * 8px);\n}\n.Config_popover__qMfu9:before {\n    border-bottom: 8px solid #a5a5a5;\n    border-left: 8px solid transparent;\n    border-right: 8px solid transparent;\n    border-top: 8px solid transparent;\n    content: \"\";\n    display: block;\n    height: 8px;\n    right: calc(35px - 2 * 8px);\n    position: absolute;\n    top: calc(-2 * 8px);\n    width: 0;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK {\n    display: flex;\n    flex-direction: column;\n    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_top__6DKJ8 {\n      display: flex;\n      flex-direction: row;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_top__6DKJ8 .Config_link__GTbGq {\n        flex-grow: 1;\n        text-align: right;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_top__6DKJ8 .Config_link__GTbGq > a {\n          color: #333;\n          margin-left: 12px;\n          margin-right: 4px;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_top__6DKJ8 .Config_link__GTbGq > a:visited {\n            color: #333;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_top__6DKJ8 > button {\n        background-color: rgba(0, 0, 0, 0.05);\n        border-bottom-left-radius: 0;\n        border-bottom-right-radius: 0;\n        border-bottom: transparent;\n        border-left: 1px solid rgba(0, 0, 0, 0.25);\n        border-right: 1px solid rgba(0, 0, 0, 0.25);\n        border-top-left-radius: 2px;\n        border-top-right-radius: 2px;\n        border-top: 1px solid rgba(0, 0, 0, 0.25);\n        color: #424242;\n        font-size: 12px;\n        margin: 0 6px 0 0;\n        outline: none;\n        padding: 0 6px;\n        transform: translateY(1px);\n        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_top__6DKJ8 > button:hover {\n          background-color: rgba(0, 0, 0, 0.1);\n          color: #222;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_top__6DKJ8 > button.Config_active__vD-Fl {\n          background-color: #c2c2c2;\n          color: #222;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_top__6DKJ8 > button:last-child {\n          margin-right: 0;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_top__6DKJ8 > button > img {\n          vertical-align: text-bottom;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_body__wtDKH {\n      background-color: #c2c2c2;\n      border-bottom-left-radius: 2px;\n      border-bottom-right-radius: 2px;\n      border-top-right-radius: 2px;\n      border: 1px solid rgba(0, 0, 0, 0.25);\n      padding: 12px 10px 12px;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_body__wtDKH > div {\n        overflow: hidden;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_body__wtDKH > div > *:first-child {\n          margin-top: 0;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_body__wtDKH > div > *:last-child {\n          margin-bottom: 0;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_controls__-N2ev {\n      display: flex;\n      flex-direction: row;\n      margin-top: 10px;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_controls__-N2ev > div:first-child {\n        flex-grow: 1;\n}\n.Config_popover__qMfu9 .Config_inner__oVRAK .Config_controls__-N2ev button {\n        padding-bottom: 0;\n        padding-top: 0;\n        margin-right: 12px;\n}\n";
  var css$3 = {"popover":"Config_popover__qMfu9","layout-reference":"Config_layout-reference__X38TI","inner":"Config_inner__oVRAK","top":"Config_top__6DKJ8","link":"Config_link__GTbGq","active":"Config_active__vD-Fl","body":"Config_body__wtDKH","controls":"Config_controls__-N2ev"};
  styleInject(css_248z$3);

  const OPTIONS = [['show_category_captions', 'Show category captions'], ['open_blank', 'Open links in new tab'], ['fetch_results', 'Automatically fetch results']];
  const Config = ({
    config,
    layout,
    setConfig,
    setShow,
    show,
    sites
  }) => {
    const [enabledSites, setEnabledSites] = hooks.useState(config.enabled_sites);
    const showCategoryCaptionsArr = hooks.useState(config.show_category_captions);
    const openBlankArr = hooks.useState(config.open_blank);
    const fetchResultsArr = hooks.useState(config.fetch_results);
    const [showCategoryCaptions, setShowCategoryCaptions] = showCategoryCaptionsArr;
    const [openBlank, setOpenBlank] = openBlankArr;
    const [fetchResults, setFetchResults] = fetchResultsArr;
    const optStates = [showCategoryCaptionsArr, openBlankArr, fetchResultsArr];
    const options = OPTIONS.map((opt, i) => [...opt, ...optStates[i]]);
    const [tab, setTab] = hooks.useState(0);
    const tabs = [{
      title: 'Sites',
      icon: 'world',
      comp: preact.h(Sites, {
        enabledSites: enabledSites,
        setEnabledSites: setEnabledSites,
        sites: sites
      })
    }, {
      title: 'Options',
      icon: 'cog',
      comp: preact.h(Options, {
        options: options
      })
    }, {
      title: 'About',
      icon: 'info',
      comp: preact.h(About, null)
    }];
    const onClickCancel = () => {
      setShow(false);
      // Restore state
      setEnabledSites(config.enabled_sites);
      setFetchResults(config.fetch_results);
      setOpenBlank(config.open_blank);
      setShowCategoryCaptions(config.show_category_captions);
    };
    const onClickSave = () => {
      setConfig({
        enabled_sites: enabledSites,
        fetch_results: fetchResults,
        open_blank: openBlank,
        show_category_captions: showCategoryCaptions
      });
      setShow(false);
    };
    return preact.h("div", {
      className: `${css$3.popover} ${css$3['layout-' + layout]}`,
      style: {
        display: show ? 'block' : 'none'
      }
    }, preact.h("div", {
      className: css$3.inner
    }, preact.h("div", {
      className: css$3.top
    }, tabs.map(({
      title,
      icon
    }, i) => preact.h("button", {
      className: tab === i ? css$3.active : null,
      type: "button",
      onClick: () => setTab(i)
    }, preact.h(Icon, {
      title: title,
      type: icon
    }), " ", title)), preact.h("div", {
      className: css$3.link
    }, preact.h("a", {
      target: "_blank",
      rel: "noreferrer",
      href: HOMEPAGE
    }, "\uD83C\uDFA5 ", NAME_VERSION))), preact.h("div", {
      className: css$3.body
    }, tabs.map(({
      comp
    }, i) => preact.h("div", {
      style: {
        display: tab === i ? 'block' : 'none'
      }
    }, comp))), preact.h("div", {
      className: css$3.controls
    }, preact.h("div", null, preact.h("button", {
      className: "btn primary small",
      onClick: onClickSave,
      type: "button"
    }, "OK"), preact.h("button", {
      className: "btn small",
      onClick: onClickCancel,
      type: "button"
    }, "Cancel")))));
  };

  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function (n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends.apply(null, arguments);
  }

  function detectLayout(mUrl) {
    // Currently there are two IMDb layouts:
    // 1) "reference": URL ends with '/reference'
    if (mUrl[2] === 'reference') {
      return {
        name: 'reference',
        titleSelector: 'title',
        containerSelector: 'main > * > section > div'
      };
    }
    // 2) "default": Default (responsive/dynamic)
    return {
      name: 'default',
      titleSelector: 'title',
      containerSelector: 'main > * > section > div'
    };
  }
  function parseImdbInfo(id, {
    name,
    titleSelector,
    containerSelector
  }) {
    // TODO: extract type (TV show, movie, ...)
    const info = {
      id,
      layout: name
    };
    info.title = document.querySelector(titleSelector).innerText.trim();
    const mTitle = /^(.+)\s+\((\d+)\)/.exec(info.title);
    if (mTitle) {
      info.title = mTitle[1].trim();
      info.year = parseInt(mTitle[2].trim(), 10);
    }
    console.log(info);
    return [info, containerSelector];
  }
  function replaceFields(str, {
    id,
    title,
    year
  }, encode = true) {
    return str.replace(new RegExp('{{IMDB_TITLE}}', 'g'), encode ? encodeURIComponent(title) : title).replace(new RegExp('{{IMDB_ID}}', 'g'), id).replace(new RegExp('{{IMDB_YEAR}}', 'g'), year);
  }

  const checkResponse = (resp, site) => {
    // Likely a redirect to login page
    if (resp.responseHeaders && resp.responseHeaders.includes('Refresh: 0; url=')) {
      return FETCH_STATE.NO_ACCESS;
    }

    // There should be a responseText
    if (!resp.responseText) {
      return FETCH_STATE.ERROR;
    }

    // Detect Blogger content warning
    if (resp.responseText.includes('The blog that you are about to view may contain content only suitable for adults.')) {
      return FETCH_STATE.NO_ACCESS;
    }

    // Detect CloudFlare anti DDOS page
    if (resp.responseText.includes('Checking your browser before accessing')) {
      return FETCH_STATE.NO_ACCESS;
    }

    // Check site access
    if (site.noAccessMatcher) {
      const matchStrings = Array.isArray(site.noAccessMatcher) ? site.noAccessMatcher : [site.noAccessMatcher];
      if (matchStrings.some(matchString => resp.responseText.includes(matchString))) {
        return FETCH_STATE.NO_ACCESS;
      }
    }
    // Check results
    if (Array.isArray(site.noResultsMatcher)) {
      // Advanced ways of checking, currently only EL_COUNT is supported
      const [checkType, selector, compType, number] = site.noResultsMatcher;
      const m = resp.responseHeaders.match(/content-type:\s([^\s;]+)/);
      const contentType = m ? m[1] : 'text/html';
      let doc;
      try {
        const parser = new DOMParser();
        doc = parser.parseFromString(resp.responseText, contentType);
      } catch {
        console.error('Could not parse document!');
        return FETCH_STATE.ERROR;
      }
      switch (checkType) {
        case 'EL_COUNT':
          {
            let result;
            try {
              result = doc.querySelectorAll(selector);
            } catch (err) {
              console.error(err);
              return FETCH_STATE.ERROR;
            }
            if (compType === 'GT') {
              if (result.length > number) {
                return FETCH_STATE.RESULTS_FOUND;
              }
            }
            if (compType === 'LT') {
              if (result.length < number) {
                return FETCH_STATE.RESULTS_FOUND;
              }
            }
            break;
          }
      }
      return FETCH_STATE.NO_RESULTS;
    }
    const matchStrings = Array.isArray(site.noResultsMatcher) ? site.noResultsMatcher : [site.noResultsMatcher];
    if (matchStrings.some(matchString => resp.responseText.includes(matchString))) {
      return FETCH_STATE.NO_RESULTS;
    }
    return FETCH_STATE.RESULTS_FOUND;
  };
  const useResultFetcher = (imdbInfo, site) => {
    const [fetchState, setFetchState] = hooks.useState(null);
    hooks.useEffect(() => {
      let xhr;
      if (site.noResultsMatcher) {
        // Site supports result fetching
        const {
          url
        } = site;
        const isPost = Array.isArray(url);
        const opts = {
          timeout: 20000,
          onload: resp => setFetchState(checkResponse(resp, site)),
          onerror: resp => {
            console.error(`Failed to fetch results from URL '${url}': ${resp.statusText}`);
            setFetchState(FETCH_STATE.ERROR);
          },
          ontimeout: () => setFetchState(FETCH_STATE.TIMEOUT)
        };
        if (isPost) {
          const [postUrl, fields] = url;
          opts.method = 'POST';
          opts.url = postUrl;
          opts.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
          };
          opts.data = Object.keys(fields).map(key => {
            const val = replaceFields(fields[key], imdbInfo, false);
            return `${key}=${val}`;
          }).join('&');
        } else {
          opts.method = 'GET';
          opts.url = replaceFields(url, imdbInfo);
        }
        xhr = GM.xmlHttpRequest(opts);
        setFetchState(FETCH_STATE.LOADING);
      }
      return () => {
        if (xhr && xhr.abort) {
          xhr.abort();
        }
      };
    }, [imdbInfo, site]);
    return fetchState;
  };

  var css_248z$2 = ".SiteLink_linkWrapper__wGnJ- {\n  display: inline-block;\n  margin-right: 4px;\n}\n\n  .SiteLink_linkWrapper__wGnJ- img {\n    vertical-align: baseline;\n}\n\n  .SiteLink_linkWrapper__wGnJ- a {\n    white-space: pre-line;\n}\n\n  .SiteLink_linkWrapper__wGnJ- a > img {\n      height: 16px;\n      width: 16px;\n      margin-right: 4px;\n}\n\n  .SiteLink_linkWrapper__wGnJ- .SiteLink_resultsIcon__mjHYM {\n    margin-left: 4px;\n}\n";
  var css$2 = {"linkWrapper":"SiteLink_linkWrapper__wGnJ-","resultsIcon":"SiteLink_resultsIcon__mjHYM"};
  styleInject(css_248z$2);

  const ResultsIndicator = ({
    imdbInfo,
    site
  }) => {
    const fetchState = useResultFetcher(imdbInfo, site);
    let iconType;
    let title;
    switch (fetchState) {
      case FETCH_STATE.LOADING:
        iconType = 'spinner';
        title = 'Loading…';
        break;
      case FETCH_STATE.NO_RESULTS:
        iconType = 'x';
        title = 'No Results found!';
        break;
      case FETCH_STATE.RESULTS_FOUND:
        iconType = 'tick';
        title = 'Results found!';
        break;
      case FETCH_STATE.NO_ACCESS:
        iconType = 'lock';
        title = 'You have to login to this site!';
        break;
      case FETCH_STATE.TIMEOUT:
        iconType = 'timeout';
        title = 'You have to login to this site!';
        break;
      case FETCH_STATE.ERROR:
        iconType = 'error';
        title = 'Error fetching results! (See dev console for details)';
        break;
      default:
        return null;
    }
    return preact.h(Icon, {
      className: css$2.resultsIcon,
      title: title,
      type: iconType
    });
  };

  // As it is not possible to open links with POST request we need a trick
  const usePostLink = (url, openBlank, imdbInfo) => {
    const formElRef = hooks.useRef();
    const isPost = Array.isArray(url);
    const href = isPost ? url[0] : replaceFields(url, imdbInfo, false);
    const onClick = event => {
      if (isPost && formElRef.current) {
        event.preventDefault();
        formElRef.current.submit();
      }
    };
    hooks.useEffect(() => {
      if (isPost) {
        const [postUrl, fields] = url;
        const form = document.createElement('form');
        form.action = postUrl;
        form.method = 'POST';
        form.style.display = 'none';
        form.target = openBlank ? '_blank' : '_self';
        Object.keys(fields).forEach(key => {
          const input = document.createElement('input');
          input.type = 'text';
          input.name = key;
          input.value = replaceFields(fields[key], imdbInfo, false);
          form.appendChild(input);
        });
        document.body.appendChild(form);
        formElRef.current = form;
      }
      return () => {
        if (formElRef.current) {
          formElRef.current.remove();
        }
      };
    });
    return [href, onClick];
  };

  const Sep = () => preact.h(preact.Fragment, null, "\xA0", preact.h("span", {
    className: "ghost"
  }, "|"));
  const SiteLink = ({
    config,
    imdbInfo,
    last,
    site
  }) => {
    const extraAttrs = config.open_blank ? {
      target: '_blank',
      rel: 'noreferrer'
    } : {};
    const [href, onClick] = usePostLink(site.url, config.open_blank, imdbInfo);
    return preact.h("span", {
      className: css$2.linkWrapper
    }, preact.h("a", _extends({
      className: "ipc-link ipc-link--base",
      href: href,
      onClick: onClick
    }, extraAttrs), preact.h(SiteIcon, {
      site: site
    }), preact.h("span", null, site.title)), config.fetch_results ? preact.h(ResultsIndicator, {
      imdbInfo: imdbInfo,
      site: site
    }) : null, last ? null : preact.h(Sep, null));
  };

  var css_248z$1 = ".LinkList_linkList__beWAL {\n  line-height: 1.6rem\n}\n\n.LinkList_h4__OVHW- {\n  margin-top: 0.5rem\n}\n";
  var css$1 = {"linkList":"LinkList_linkList__beWAL","h4":"LinkList_h4__OVHW-"};
  styleInject(css_248z$1);

  const LinkList = ({
    config,
    imdbInfo,
    sites
  }) => Object.entries(CATEGORIES).map(([category, categoryName]) => {
    const catSites = sites.filter(site => site.category === category && config.enabled_sites.includes(site.id));
    if (!catSites.length) {
      return null;
    }
    const caption = config.show_category_captions ? preact.h("h4", {
      className: css$1.h4
    }, categoryName) : null;
    return preact.h(preact.Fragment, null, caption, preact.h("div", {
      className: css$1.linkList
    }, catSites.map((site, i) => preact.h(SiteLink, {
      config: config,
      imdbInfo: imdbInfo,
      last: i === catSites.length - 1,
      site: site
    }))));
  });

  var css_248z = ".App_configWrapper__bVP2M {\n  position: absolute;\n  right: 20px;\n  top: 20px;\n}\n\n  .App_configWrapper__bVP2M > button {\n    background: transparent;\n    border: none;\n    cursor: pointer;\n    outline: none;\n    padding: 0;\n}\n\n  .App_configWrapper__bVP2M > button > img {\n      vertical-align: baseline;\n}\n";
  var css = {"configWrapper":"App_configWrapper__bVP2M"};
  styleInject(css_248z);

  // Note: GM.* only work in async functions
  const restoreConfig = async () => JSON.parse(await GM.getValue(GM_CONFIG_KEY));
  const saveConfig = async config => GM.setValue(GM_CONFIG_KEY, JSON.stringify(config));
  const useConfig = () => {
    const [config, setConfig] = hooks.useState(DEFAULT_CONFIG);
    hooks.useEffect(() => {
      restoreConfig().then(c => {
        setConfig(c);
      }).catch(() => {
        setConfig(oldConfig => ({
          ...oldConfig,
          first_run: true
        }));
      });
    }, []);
    hooks.useEffect(() => {
      if (config) {
        saveConfig(config);
      }
    }, [config]);
    return {
      config,
      setConfig
    };
  };

  const App = ({
    imdbInfo
  }) => {
    const {
      config,
      setConfig
    } = useConfig();
    const [showConfig, setShowConfig] = hooks.useState(false);
    hooks.useEffect(() => {
      if (config && config.first_run) {
        setShowConfig(true);
        setConfig(prev => ({
          ...prev,
          first_run: false
        }));
      }
    }, [config]);
    return preact.h(preact.Fragment, null, preact.h("div", {
      className: css.configWrapper
    }, preact.h("button", {
      onClick: () => setShowConfig(cur => !cur),
      title: "Configure",
      type: "button"
    }, preact.h(Icon, {
      type: "cog"
    })), preact.h(Config, {
      config: config,
      layout: imdbInfo.layout,
      setConfig: setConfig,
      setShow: setShowConfig,
      sites: SITES,
      show: showConfig
    })), preact.h(LinkList, {
      config: config,
      imdbInfo: imdbInfo,
      sites: SITES
    }));
  };

  // Parse IMDb number and layout
  const mUrl = /^\/(?:[a-z]{2}\/)?title\/tt([0-9]{7,8})(?:\/([a-z]*))?/.exec(window.location.pathname);
  if (!mUrl) {
    throw new Error('LTA: Could not parse IMDb URL!');
  }

  // Only enable on title page and reference layout
  const shouldEnable = [undefined, 'reference'].includes(mUrl[2]);

  // Only enable on title page and reference layout
  if (shouldEnable) {
    const imdbId = mUrl[1];
    const layoutInfo = detectLayout(mUrl);
    const [imdbInfo, containerSelector] = parseImdbInfo(imdbId, layoutInfo);
    function injectAndStart() {
      let injectionEl = document.querySelector(containerSelector);
      if (!injectionEl) {
        throw new Error('LTA: Could not find target container!');
      }
      const container = document.createElement('div');
      container.id = CONTAINER_ID;
      container.style.position = 'relative';
      if (imdbInfo.layout === 'default') {
        container.className = 'ipc-page-content-container ipc-page-content-container--center';
        container.style.padding = '0 var(--ipt-pageMargin)';
        container.style.minHeight = '50px';
        injectionEl.prepend(container);
      }

      // reference layout
      else {
        container.className = 'ipc-page-content-container ipc-page-content-container--center';
        container.style.padding = '0 var(--ipt-pageMargin)';
        injectionEl.prepend(container);
      }
      preact.render(preact.h(App, {
        imdbInfo: imdbInfo
      }), container);
    }
    function containerWatchdog() {
      const container = document.querySelector(`#${CONTAINER_ID}`);
      if (container === null) {
        injectAndStart();
      }
      window.setTimeout(containerWatchdog, 1000);
    }
    window.setTimeout(containerWatchdog, 500);
  }

})(preact, preactHooks);
