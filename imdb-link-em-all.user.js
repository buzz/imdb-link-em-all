// ==UserScript==
// @name           IMDb: Link 'em all!
// @namespace      https://greasyfork.org/en/users/8981-buzz
// @description    Adds all kinds of links to IMDb, customizable!
// @author         buzz
// @require        https://code.jquery.com/jquery-2.2.0.min.js
// @version        0.123
// @license        GPLv2
// @match          *://*.imdb.com/title/tt*/*
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.xmlHttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @connect        *
// @noframes
// ==/UserScript==

// TODOS
// - config dialog: subtitles to left col, trackers mid and right col half-half
// - detect TV show/movie/video game?
// - hide on video games?

// Test cases for different layouts:
// http://www.imdb.com/title/tt0163978/
// http://www.imdb.com/title/tt1166810/
// http://www.imdb.com/title/tt4380968/
// http://www.imdb.com/title/tt3087990/

/*******************************************************************************
 * Constants
 ******************************************************************************/

let LTA_HOMEPAGE = 'https://greasyfork.org/en/scripts/17154-imdb-link-em-all';
let COGS_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACiElEQVQ4y41TzUpyURQVH8C5j+B7OGkSVJPQJlYQFSZOFJNCq4tEQoNqoIYo5Q+lUIJJUln5U6lXS0yU0kEWFwUdOb13t/eB/BC+oDO53HPOWnuttc+WyX5ZhUJh7uHhIZXJZFK45mR/WS8vL6pSqaRAsBzB3a+vL/j8/IRIJNK9uLiQx2IxRTQaVf0G9iBYzOfzQi6XU97f3wutVguazSYgUDg/P1cikRAKhcSjoyPPCPj5+dn6/v4OvV4P3t7eAMGDm5sbqVarQbVahbOzMwnBA1QGgiBAIpGAnZ0d65AAq66hV4lICNBoNBjRDwH9VyoVIILHx0ewWCyS0WhcG1GRzWY5ulwsFuHp6QmSySQcHh6C3+8nRYC24O7ujlXf3t7mhkBk5LF6+/b2tl+v14Hnebi6uoKNjY2c2WxWr6+vq3d3d3PpdJoR0bnT6ew7HI725uYmL0Ow2Ol0mFyqjEFCIBCAra0t9U8Rt9utxgwA7zJlpIbCXV5eFmXYY/Hj44N5pAOqgInD3t7ekODg4EAdDoeZArKAatl9nU4nyrAlPEps+3y+frlcZiSUg9frzblcLvX+/j6zQP7J2uXlJczPz/enp6fbU1NT/DALlMhhkCwo+uJDgpOTE8C+sz1sK8Tjcba3uLjIjXTg9PR0LRgMSq+vrwxM7cKHxTIhIlJE+9fX1+xsZWVFWlhY+NfG4+NjK8mjl4dEgOkOOI6TKDTyrdfrJQQN6Iy822w2mJyctI6osNvtHoPBIKI/wWQyKZFEoGqkYHZ2VtBoNEr0LYyPj4tjY2Oe/84DEqiWlpYUq6urciTskmScA9BqtV0kkM/MzCiQQPWnyUTZc1gxNTExkUK5v47zN4DwH7fniYcmAAAAAElFTkSuQmCC';
let TICK_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABoklEQVQ4y9WT2S5DURSG3TnOu6ipVUPFlJCqIdVS6nBKKS2NG6qno5aSEsNxKeahIikaiiASl2qo8AziJVR/WxNTL6R6IbEud/aX9e9vrZ2S8u9KtVbL1y9WOZOCG1dreOOBFvo9FlK+lPsV3LBSzfftd2Dm3g3PpQUanwrFo3nWhGDlsow3BDSYunNh8s6J9q0mlHjyUeAQUh+XDGdsefcx0xUPK5Zk/FvkibAT3rAj1rnILY7k23O+wKesRHfEPHEXRrD+hv73cyKL79ltg/fWjvFbG9jNRkhcuZE8W/YnrD9pq9AdtjyOhThMhYeh9skjRFa/fEE62b3DYOzGBs81h9YNJQqHRRGxNYv6FrErqE7TBpphOu/F7MMoPCELDPsaGINajITMcF+bwawrUOAUvuRa4uD3YrYVNOkM46E29s7xGytcVya4Qiao1+rfZEVFXCb1o2kii5bPS9Hpb4H7agiOywE0r8hBZEVF5gwqoXFJ58royukSElkJ1XIdiKyocEhA/WphyHzpohExiKznHJMgNamVJbLo7MH01D/5XK8FJMUEaMuG0gAAAABJRU5ErkJggg==';
let CROSS_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACEklEQVQ4y61S/U9SYRhlbW13/Q0V5Woub05zfZkCXhUhpmmb8v3h5ZKoCQjcwVBi1Q+19Zf0d2lWxpeR3AuX93J8qGVjgK2tZ3u3d3t2znmecx6D4R+rsS5dGdiEnDXS4weCQ2Fe9QUSdafH3B+c3UM7k4OeSPWQNIIi3xAjaG5u48fz1Y+1peU7PWAU3qBNT0/KaG3tnJOogXWe1NGKJYB8AZ3/ic2RqMxaL/0iSGe4dlLW23uvgPcfoOfyHQI0RYlX/SGe1KHtxAHqqyERJwtPWUWYv9w1oh5PcuxlnOlyFnj7DiydQSMcAalD244Buf2f/6rVTuA5rq9JregW15Q2WCu2S+u8BvYLBMwD2RxUfxDVeRurzMxyF8cUFDnFG9CRo3V8QcDtA+QMqnMLetkicH/NWfH4O1EBlAacHmDVBeymaG87ipPT/MVgt49XvH5okSiQkgmYBuK0DhmorrlQMVnwdXyiP0nd5eUVjw+atAFQjIrbCzKLlabN+unSChDdRP3ZCor3H+JoeKSbhC6LJ3Vo4RekmoRCo5NZrDRl5oqPJrnjiQesZrUBYQmndgeOR8dweGPoDwldllB3uqGJEpQ1N8gsVnpiOjfsy+g493nkLvtuEaA4FvFt7B4OrhmFrinosoTa4jLK5hmdzOpx++j2MPdp6BbrC/5dZZNFKD6eGhjVofEmd3D1umD4n3UGltFKFJhJvx0AAAAASUVORK5CYII=';
let ERROR_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACJklEQVQ4y6VTTUiUYRB+vh93dX903bKUYMNlMWHJBC1WW8GjZVCnfpa6Fp1i6dilQwcJglgrDEKiQqhDRYWVCEsSFJ0Ksh8zKjJZ3V0WU3G/73tnpoNrFGkZzmHmMDPPPM8wA6zRtJUSuXSHISSvhLnALJ21Xc9ouTp9JQAhSblqd0VdG7viQnz0v2hlh+PBqaH272TPiF0Ylcl72/MTd1qCq2bAxNcqQgm/puswvUF46hNBIT6zqulTj9ubMw9jJGSJNXVB7Gy/sJ2TLze3qc8DW5v/yUCYb/gakzqrOXwcuoXxR1fBTgaBppMGE/f+FSAzGEuUVbdFvZv3YeFrEiKACFCc6IE/0g13bUf8w5WGxLIAmcGYj5lTnvABsMoDXOoWAbMDLo6hqvEgmPjsu0th3x8ATNzvCe1f564Ow8ndBiAoD3iWhMHKXERFTQiVWw5tUkXn1G+HNHl/R0SY39btTpu08BLO9GUwA3pZOeZzs3B7GYYhMCo7Yfj3YrS31SZLRVtO58f1xaPhAV/DcVN4DjT7HBAGIPg08h7TbyYBCCAMVRiGps+jJpZ0Kcs5DwDat7ut3UZV04MNHSmo2SdwstcXJbFARAME0A2BJjZECLqxHuX1PXjdl8DM2Mgek4n6ApHDAADT1w7T11YSpy3JLzn5uQ9oLtTtPIbCaPqcKcTp7NMTR4QYTIxfIzkEshwoywFZDshSIFuBHAIrAit6sdZvxg9QwSUH1+qgEQAAAABJRU5ErkJggg==';
let TIMEOUT_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC4klEQVQ4y62TXUjTURjGjel90U03XdhF1EVQXQRBQVheGpGFGShIAyX1wu/5lVlpZllqTE3TqZu5zeYHmm66+cU0tc21mcvpPpwzvzbnf85N/at7OhNaSRFd9MLDeTmH5/e+5+UcP7//HX38wqDhpgcyZTtr9bM4k1Z2ZNByQcKSpDqhtfVNxsW/mgeF+WWabta2RTeClUUDHA47KMqG+VkNNHI+xG+jNwSv4rL/aO7n55XoFeWwW83Qme1432tCmWgSpcIv4HbpMT69BJNuGJ1VMeDkMVMOmCXcgkuK9mTatmzCoGoBzX0m6C0O2BxOWB0b0M05wO3Wo2XAiClVF3iP77iq8u+f8wGkdWmdM+Tg6+wqhDIjvGGnKEx/W8Qmyb1yeoCKDj3kajN6eEmoyArn+gC99fGLC+YJ8CQz0JLKrh0PnC4X2DUcLBPQ+tYWRJJeDE5TeN6oxsSYAFWZoSYfQFYXt2m3zaOwQY1lNw371h62SdX0h7ngNbchLScX3cOjmKBoJLJHMWcaRU3mLbcPIK6M3rStGJDLUWHOSRPIHizUOp68KNo3D6o0sO4AChuN+OKPMBsGUJ0e+hMgehlpNEx0oVioxsAMhQVyacs6jc7+IRhXHVjaBTRNbPRGnII0KADS0KNojDhN+QC1eZGcfgELw+ppFAh1sJKB2WlgfY+I5DMtZdCkXsbmhyJ4tGK4+In4FHvG033VP34fUP009mz9ozD3lKIeDV1KPBNOQWVag5PMw+miIQ0/ATcxozQESDsC5AfCWngFkmsMo6+Lytwo1ruC29COlKFvTIF8zghSS4eQVCzfb9ujbMavsZZzjOz7ew48KHZWRHYl64azrfwuxmV5MGp5ME7WoufmYWxU3wOIaSvVD3YicwwDkmDG/G9Pmp0ddaEkJbTxdeJ1c3lyiNsrEfM8NcI86VlIC8RKegAMzEOQhfjvioMZGf/8S+Vhx1mkosnbNlktP8zfAS4IMMSANgzlAAAAAElFTkSuQmCC';
let NOACCESS_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACfUlEQVQ4y21Sz2sTQRh9u9nml02M2hoapaZNtaIg4q0eBMEeRPGg3jyJhyK00EvpsZBr/wqhAfHQs3fBglRa0EYTm5YYFEqKSRvTJDs7s77ZbdpYHfiYmW++7817b8bAiZHL5fqVUnNSygnGWQYYvxgrjuMszs7O/u6tN3o3S0tLN9m8nEqlRuLxOEzTBPdot9uoVqvY5iDQ4/n5+fV/ANjcz8O1TCYzZts2KpUKms2mvh2WZSGZTHp1+Xx+k7kbCwsLLb03uwBMvhwaGhoTQqBYLG41Go0010Edel0oFH5qYLIbo5Tpbp/VXTA5EY1GUSqVwKaHMzMz5R515Ww2e69cLufT6bRX+z+AQa2Zt+n19klzdU6z0zVkO/iXB+V3z92V0jh29iKe5kfXVxFwBVzpwHX8EELi1fotz9RkuIYHF1ZxdWrN8Bm4Lp4+uUs0E0Ygwvk+oIhthfUhDRKQTgPZySbzwmvZfP3+WIK+SRc6u29ghQZgGP0s7AMiCaYVcLAHuf8NdusHlHOAyMg0XLvTA0CKUPomG/WNj9R5Colrt1F5u8j+8xi+M4n61w0C1BBLnyFhCVfYvQDCk+GSamL8CszgAN1RkB2JT7sRDMNGIjOCdjPE2gOPVRfA+wcu3dWoWmvt8zpZfOCJA9VW6LRI1SWzwhfUi999uUp5PccM9EajUkLichqB6DkC2Bh9NoVRwYb9HZzOpBDc7/MZUO4JANtDVY72YIMAMSBMI60g8xqgjlatCtFsIDYcp93Kl90LoCWELr5A5FIARjDkP6HJl1CUZrcQazWosEOi0vdLG38EwCfZWp7zvfA+jjgM52jmD/M/lpT+WgNx/AHLKabZmE0zigAAAABJRU5ErkJggg==';
let LOADING_ICON = 'data:image/gif;base64,R0lGODlhEAAQAPMPAOjo6LS0tHd3d6KiotbW1oCAgMXFxZGRkfDw8Ly8vJqamomJic3Nzaurq3h4ePj4+CH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQFCgAPACwAAAAAEAAQAAAEW/DJh2gbdWq6ABICQG0SAH4hImrekwhvmpUKjA5Y1nIgsZY7CoJx+JU0CQXOQBKqkkomSaUSEgIzIOulMKp8k8DCMEx4AAwKWM0hMMjm4wSBczHR2RLWrm3qmxEAIfkEBQoADwAsAAAAAA8AEAAABE/wyflCk4hOJRcujNY9i0MKhCgZJctt4GkJQpZJAwlMxK6+qgejYUkFhQOi8YgxiG48RU6DANwSipAhhMFAcQACoxoMOMWrpyGDfviCVlEEACH5BAUKAA8ALAAAAAAQAA8AAARO8Mn5TKJYNr0QOpnkDF83hEglMMrCTADBMWWSHAKQCDl3wgZeD9ZIwVZEGyDjaTIC0JC0MsU0EsaphYAgcJsoTQwADhlk5IdH+lIv1ZQIACH5BAUKAA8ALAAAAAAQABAAAARS8MkpDb0VoaH0INhzBFvXYMhUEBwhnFrVAKVhKAJiCEX6BCPaxBX6XQAvms7GCDUK0A8TgHnyDhTQUekDJCzFoYEbfnQJGl8YbVYXqe0yJYaJAAAh+QQFCgAIACwAAAAAEAAOAAAEPhDJiUKgWA4pBM/c1iEFqHmdQWJDQZCH5VXruWGzSt3sBFQ6VmdkuWRKHx+GIDhkgr7hDzE1DTNVCoEnyYIiACH5BAUKAA4ALAAAAAAQABAAAARX0MnpCKHYIYZ26F+GBFySjAuQaQ1gAkWCWYBnBce2KJKNTJ2BIEdxYRAKQ2dZ+80G0FPTSTHsYsWn4VgrMgRD4HRZEACEBWrmO5AwRJSFeaXWCLYr+CQCACH5BAUKAA8ALAAAAAAQABAAAART8Mn5AKBYEm105g/TGconJYj4KAxmISFhkZLSTHPWFIN7YY0WDgHLMBrICrGIOR4OAdNkwCBKPSsmcFe5HUwFQeIRtXwQ4d/v7BBcHMLz4KCVRAAAIfkEBQoADgAsAQABAA8ADwAABFHQSYAQIZXJPScmDcd9WEN0yEZRTFANSSWLTnAEYiomJ02DgYDGN2kMYEQHwkSbKQELAU4kkCYUi6VAwUlIowZpswotIA4+hgBTMEN7o83AFwEAIfkEBQoADwAsAAAAABAAEAAABFPwyfkQoljabcnNANd9mIgkAGgSjJQYWWk0cIwZqS2/+gQEwJaEsCDcchqFQFCbKBMah+AAmBoYDcVp0XAZXYcDg6nJLBBhtMPmCC0OEoXtA4xFAAAh+QQFCgAOACwAAAEAEAAPAAAET9DJ6ZC1NEvsiM6XpwFXCUiG+E1MQiDgSDVF3XwtQxxCr+AG18VQOFEMqw5sQ0NKFoIGYqHIDRC7AMrYGVQLjMrngPCWD7jF8+eQJtuJTwQAIfkEBQoADwAsAAABABAADwAABE7wyUkfqngiUAHHXiUISSdtHzEKn0a0UkB217Tc2fO+g1MUgczug2AoMAzM4FRJNJKSwyOoGPAaMYOEENMFGgBprnD8To8gdGOJCOaymQgAIfkEBQoADwAsAAABAA8ADwAABFHwSVKAvPjSlbscAuNJ3AMIQgcg5oIa4oWsmOEQ2Twnh6IkqhUg4FoAc0IdYaDCIIiFDiNB2IWegdV0J7K0CIlsw8uSIHpYxLbTkIR3o0kMEwEAOw==';
let CATEGORY_NAMES = ['General', 'Trackers', 'Subtitles'];
let DEFAULT_CONFIG = {
  enabled_sites: ['google', 'yt'],
  show_category_captions: true,
  open_blank: true,
  fetch_results: true
};

/*******************************************************************************
 * Variables
 ******************************************************************************/

// movie details
let imdb_id, imdb_title, imdb_year;

// new or legacy layout
let layout;

// alphabetically sorted site keys
let sorted_keys = [];

// script runs for the first time?
let first_run = false;

// script configuration
let config;

/*******************************************************************************
 * External sites
 *
 * 3 categories:
 * let sites = [ { GENERAL }, { TRACKERS }, { SUBTITLES } ];
 *
 * single entry:
 * KEY: [
 *   TITLE,
 *   ICON_URI,
 *   URL,
 *   NO_RESULTS_MATCHER,   (optional)
 *   NOT_LOGGED_IN_MATCHER (optional)
 * ]
 *
 * KEY       site id (must be unique among all categories!)
 * ICON_URI  preferably a base64 data URI (format: PNG)
 * URL       either a string (GET request):
 *             search URL (use HTTPS if available), the following patterns are replaced:
 *             {{IMDB_ID}}     e.g. 0163978
 *             {{IMDB_TITLE}}  e.g. The Beach
 *             {{IMDB_YEAR}}   e.g. 2000
 *           or an array (POST request)
 *             [
 *               URL,
 *               POST data (Object), values are strings, with patterns replaced
 *             ]
 *             example:
 *             [
 *               'http://www.surrealmoviez.info/advanced_search.php',
 *               {
 *                 simdb: '{{IMDB_ID}}'
 *               }
 *            ]
 * NO_RESULTS_MATCHER    either a string: if response matches this string -> No results
 *                                        e.g. 'No results found!'
 *                       or: function($dom, response) that must return
 *                         true:  no results
 *                         false: results found
 *                       Note: if this value is not present -> no automatic fetching for this site
 * NOT_LOGGED_IN_MATCHER either a string: if response matches this string -> Not logged it
 *                       or: function($dom, response) that must return
 *                         true: not logged in
 *                         false: logged in
 *                       Note: if this value is not present -> site is publicly accessible
 *
 ******************************************************************************/

// MISSING?!:
// blu-bits
// MyXZ

let sites = [
  // general
  {
    google: [
      'Google',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB00lEQVQ4y42T3ysEURTH90XZ9eT/kDYRLS8oP98ohuKBIvFC8eJNIQ8U2c3GvvhtbEh+JT8SL8rvFosnKTH7o1Vrmdmd+bp3dmbtj9E69W3mds/5nHPuPVenizNJkrJEUbQSPREJih6JJgAYdX8Z2TQQJxuSGIWTJHqt4GPqIPE8AvY5eNsa4KooAFdqgrelHp9L0/KeAjmKgaiZRe4N3mYGXHGOpnw9HdGVTER6VjN7mmpkR1d5PvxTZgg3lxAc1/DbLPA0ViH08hzfkZFmt9K/4OUY3FW54ErySNCVVvNa52GhgCe6CJ3mgF83IDDbjv8aiXVSgCBXcJCG4F4KJPdWjFNRvz9BveyXCuB/AfuGMMC1mRTQPR8LeKSLj5MMePbSsXY9/GfJfSvfMmB481sF3OuUCcP53RDK2ErksTW44G4Tgp2vIkoGwxUcO0MqYJwOkZEu+JCA2u1OZC9Ww8QyGL2axtm7g8DuMOlgUTFjReGAD622ACQpDCUjkKkOknyV759uMApES8zqCN58kprdHP2A9HQ85UrImS48bKBhtwemZUaupm6nC7ZbOwLBSO+H5JMa/wr1aiVJ7t6cEBz3sIx0wuiQ0GtSdE8PLNJzlP0AcUb9Jl4kdUgAAAAASUVORK5CYII=',
      'https://www.google.com/search?q={{IMDB_TITLE}}+{{IMDB_YEAR}}'
    ],
    googleimages: [
      'Google Images',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB00lEQVQ4y42T3ysEURTH90XZ9eT/kDYRLS8oP98ohuKBIvFC8eJNIQ8U2c3GvvhtbEh+JT8SL8rvFosnKTH7o1Vrmdmd+bp3dmbtj9E69W3mds/5nHPuPVenizNJkrJEUbQSPREJih6JJgAYdX8Z2TQQJxuSGIWTJHqt4GPqIPE8AvY5eNsa4KooAFdqgrelHp9L0/KeAjmKgaiZRe4N3mYGXHGOpnw9HdGVTER6VjN7mmpkR1d5PvxTZgg3lxAc1/DbLPA0ViH08hzfkZFmt9K/4OUY3FW54ErySNCVVvNa52GhgCe6CJ3mgF83IDDbjv8aiXVSgCBXcJCG4F4KJPdWjFNRvz9BveyXCuB/AfuGMMC1mRTQPR8LeKSLj5MMePbSsXY9/GfJfSvfMmB481sF3OuUCcP53RDK2ErksTW44G4Tgp2vIkoGwxUcO0MqYJwOkZEu+JCA2u1OZC9Ww8QyGL2axtm7g8DuMOlgUTFjReGAD622ACQpDCUjkKkOknyV759uMApES8zqCN58kprdHP2A9HQ85UrImS48bKBhtwemZUaupm6nC7ZbOwLBSO+H5JMa/wr1aiVJ7t6cEBz3sIx0wuiQ0GtSdE8PLNJzlP0AcUb9Jl4kdUgAAAAASUVORK5CYII=',
      'https://www.google.com/search?q={{IMDB_TITLE}}+{{IMDB_YEAR}}&tbm=isch'
    ],
    bing: [
      'Bing',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOBAMAAADpk+DfAAAAGFBMVEVPUU5hW0ZtYkGLczSkginElRnZoxL+uQNIeozOAAAARElEQVQI12MoBwOGAhUIxQihGKBUkRuYKmYQSQcJMjCwg6hiEMVUZgCi1AwYGMMZigwYGNzLgeoYzIAaygNFQdohRgMAOIQZ19+LH9IAAAAASUVORK5CYII=',
      'https://www.bing.com/search?q={{IMDB_TITLE}}+{{IMDB_YEAR}}'
    ],
    ddg: [
      'DuckDuckGo',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACqUlEQVQ4y31TXUiTYRQ+m64uFpRdFRQkUZKY2nSmS8EpG1ZQ1EUYgVfSDyNCwqgIujBCKzW6MCKioDHFwCkZSf5mIBExtuncHG5+bU4zppN9m1Pc9vR+38R/PPDywnme5/y857xEm8ynkWu9xUl6r4rgySd4CwiThexWy/Q+zV4t7WRcYTL/p1gG/vNbxGPLWG+hHgM8Gjk4tYzfXlwkwUz1OZEcnRzH3Ku7cKUTxo8Spm/kY+FHh4j9e3ARXJEUG8WqJN7/7DqwGMFs/S3E/FOrmWfulMB1jOA+SZht0Ik+//ObEDSi2KWWl3Jl+0Rg+nYJONbzFpuwgGMB3ArCzP3LoosrS4GgJecZ6XCovw2hbwY4WaaFljo09QBDI1NYWo5hjpHf94URbG6AK4fgzCKEuj8h1G+EoCWnMpHRU5EF5wlCpPUFRgLAkbP1MPY5RCy30ghTSzvDJXCkS8FdPS36nbkEGlMkAoxlE8YyCHzrSwjv3/F9fF0PFkSHNIiZGDdK+PsooXEwDTlOrQRQJcGeyWZfmb9O6AbMhKUvrDJ2Ak0SxtsFe0ayiNqFAKMrFUxUKGBjDyU41yyKOAsQNhD8tTJEugjz79hor+SJqI0lJ1se6YPsEee79LCmESyHCfH5wGqI2ZrH8KiZ8IkE0zoJRlmCQGczgr1tsOWQnuyq3Vp7aUpiNDotzAfZJHo71oroHoQ9lWAo2iMulVd3IVF+6X4IWnEXhrPJ5atlCxTmMVl1CYGnVXjjK0dmrwYFg+ehHkgD1RxCsPoawIcxxbiCZsM2mhTEc/cSSxL/9RNfFxsh70xFoaUCja46vPYMiJjvYTkE7rb/4XcOua1KKXjjhy3LuNz+EXZlMqyMs+OPtCnpgCmTWszHKWJlPQvHnEYRC/MJ2Gb+f/b6WxPpu76IAAAAAElFTkSuQmCC',
      'https://duckduckgo.com/?q={{IMDB_TITLE}}+{{IMDB_YEAR}}'
    ],
    yt: [
      'YouTube',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAq0lEQVQ4y2NgGB7gmaK4GhDvAeL7QPwOiL8C8X80/BUqB1KzG4iVkA3YhEUDIbwW2YBnZBhwD9mA7+gKfl268P9DRdH/59pKuAx4h2wAhgIY+Pf50/+vS+b/f2lniq7mL1EG/Lp25f/7vIz/z1Sk8BrwDd2An6dP/H+bGPX/mZIELi+8pWogbiTDgNXIBigD8RYgvgPEb4D4ExYNH4H4NRDfBeJtQKw4TPIRADVAMY00MJoyAAAAAElFTkSuQmCC',
      'https://www.youtube.com/results?search_query={{IMDB_TITLE}}%20trailer'
    ],
    wiki_en: [
      'Wikipedia (en)',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA20lEQVQ4y62TjRGDIAyFZQpHYAgncBRHYAE3YAUWcA0WYAHHgN5HGy/Yas9a7nJKfl5eHtB1r5VzLles0+tqcQPya/EGchsgxliGYYBO8d5X5ziO235d1xrH+A8hlL7va05K6cmAgDGmLMtSZG+tbQDxSVfA3kYgSQekE6DzPDd+AW4AGAXafMUHC0zPTKNDEQnqhGmaKgvdxDl3DABdtEAcAQQA2gKotfh4jFCmC2DMyvz4KATg6z2gGyxkFDkhBNb6nF4kaGul6bwX7xRANNC2n/0v7+HWi5S6B3M1U+/DW+K0AAAAAElFTkSuQmCC',
      'https://en.wikipedia.org/w/index.php?search={{IMDB_TITLE}}'
    ],
    wiki_de: [
      'Wikipedia (de)',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA20lEQVQ4y62TjRGDIAyFZQpHYAgncBRHYAE3YAUWcA0WYAHHgN5HGy/Yas9a7nJKfl5eHtB1r5VzLles0+tqcQPya/EGchsgxliGYYBO8d5X5ziO235d1xrH+A8hlL7va05K6cmAgDGmLMtSZG+tbQDxSVfA3kYgSQekE6DzPDd+AW4AGAXafMUHC0zPTKNDEQnqhGmaKgvdxDl3DABdtEAcAQQA2gKotfh4jFCmC2DMyvz4KATg6z2gGyxkFDkhBNb6nF4kaGul6bwX7xRANNC2n/0v7+HWi5S6B3M1U+/DW+K0AAAAAElFTkSuQmCC',
      'https://de.wikipedia.org/w/index.php?search={{IMDB_TITLE}}'
    ],
    wiki_fr: [
      'Wikipedia (fr)',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA20lEQVQ4y62TjRGDIAyFZQpHYAgncBRHYAE3YAUWcA0WYAHHgN5HGy/Yas9a7nJKfl5eHtB1r5VzLles0+tqcQPya/EGchsgxliGYYBO8d5X5ziO235d1xrH+A8hlL7va05K6cmAgDGmLMtSZG+tbQDxSVfA3kYgSQekE6DzPDd+AW4AGAXafMUHC0zPTKNDEQnqhGmaKgvdxDl3DABdtEAcAQQA2gKotfh4jFCmC2DMyvz4KATg6z2gGyxkFDkhBNb6nF4kaGul6bwX7xRANNC2n/0v7+HWi5S6B3M1U+/DW+K0AAAAAElFTkSuQmCC',
      'https://fr.wikipedia.org/w/index.php?search={{IMDB_TITLE}}'
    ],
    wiki_es: [
      'Wikipedia (es)',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA20lEQVQ4y62TjRGDIAyFZQpHYAgncBRHYAE3YAUWcA0WYAHHgN5HGy/Yas9a7nJKfl5eHtB1r5VzLles0+tqcQPya/EGchsgxliGYYBO8d5X5ziO235d1xrH+A8hlL7va05K6cmAgDGmLMtSZG+tbQDxSVfA3kYgSQekE6DzPDd+AW4AGAXafMUHC0zPTKNDEQnqhGmaKgvdxDl3DABdtEAcAQQA2gKotfh4jFCmC2DMyvz4KATg6z2gGyxkFDkhBNb6nF4kaGul6bwX7xRANNC2n/0v7+HWi5S6B3M1U+/DW+K0AAAAAElFTkSuQmCC',
      'https://es.wikipedia.org/w/index.php?search={{IMDB_TITLE}}'
    ],
    rt: [
      'Rotten Tomatoes',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACuUlEQVQ4y4WSy2uUZxTGf+9833wzk0kyMXRiHCVpYipGkmpSsSQqWIMrFypoU1eluyL+AbpS6Ka7dpN1obQgIggi0tJupO1CCN4iGi2EaLxkMpnMxbl8l/d9Txch8YLaZ3V4OOfhdw4H3qMT5/d4n50du83/yHmXefL7sf4Yqjf1rHZs59GPXw5+2jVz/8biOwPcteLbc5/Hg7TTLonYuEadUZEd9Z/Wkm19racTA63jwKkPEkxff2bH+jq/rqZiP7tpt/ferO+apQCnM7GlpSU+fHx3bv+RoW57YiD74Mq9vF2bU2vF5SPDe//alf41WdG9L3IJnI44L6qGXMZh4/06PfM+Tzd51Lq9u3vuNia/unRndj3g1u5tX8y1O7+NFrWXScWY7k9y8UAH47+vcHO0FcnEOfPDc1p8YTkO/+xIlkcWovGRmUcP1PNtA5mEL7Mq63Q/6o1zoyfJw6zHcCFkcrpGqWiYOpnlyz8qfDIXrO9uYabhMep6gXxDSnWrLpcd2SRDbS2gY1gx2I1xNjSEo9dKhGn3jeMpGE6EcthVlgmSCpV2UB0ezuYMKuWhVREph5CKGFyIePyRrA8LYEQIkAkXaMUCVkALEmpQCrRd9SzEBPryGgGsCCHQEKEuts1FWKYpSMVgiz5QBlch5RBb1kjNIhYEIRLwRXiJULaWujUFF7iKL8dtXq/iVTXEFFI3SEEjVYtexaUuQkUsK8awbCJE5KoqbtnqIdxGMUhCQUpBDAgE0xRCLTREqIqlZA1Fq8lHIaUw+PN8s35IARQ3b90OXAe6hFe4TRFqCGVrKBpDwYQsBj6F0P93g+vt+85vLK1/4nKuvwf4ScPBAKH2Fm4+Clj0m1SMvtDuuKd+jMLSG6+8pvlNffsrIpMFa8YKNsotRaFdCYMnFR39HYn8MqWjO6/3/wcnxm4ToFhoKQAAAABJRU5ErkJggg==',
      'https://www.rottentomatoes.com/search/?search={{IMDB_TITLE}}',
      'Sorry, no results found for'
    ],
    mc: [
      'Metacritic',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACc0lEQVQ4y5WT3UtTcRyHf05KEGRblptn7szpNt3cOWdzvrQQUbPVhYIXKUgalllmiFZChBhKb4baTULe6EWghvRGFwViIRjdCJapFXqmYok3/Q9PN6YZGvXcfx6+fPh8hdgDluygSxCVISoj/hWWLbDgY/R+Kd1Xj9F8KkT7BY1vEzmwJv1dxKqJoXsl5ObmkOzwIeIt+LQwgVAhh2wOGmvzYC0d5vzsGu66Usy+xHScHhU5NZWGM3X8orenHxFzkEiRAmvpOwXoEi8fFmO0ZqBo2SRJViRZBuDLwjwb6+sAjL9+hRBmGquD8N22LWExlUhJGMmZhcvjoqK8nIH+fgBcHg+S3c7C3CcAhkee4crwM/9C2xZ8GCvC6w8SE59ARVkZv3OxoQEhDGR4vczPzgJQc7qZ1lofRFMQLNkZ6SvFaHGiahoz09O8GR/nelvblqTlUhNCGCgsKKC3+y4Wh5e2+kLQJQS6kzutAXIPF28FqqsqiRWCc3XbJXZ1dGCTZWyyjFly09l8HPTNHiYH83BlKDwZewrAx5kZQqEQQhg4X38WgMmJCdLdbrKzg1hkLwOdpaDb2RxPJuE8BSGMPH08DMBKNIqqacQZjVRXVRIKhVBVhcysAD5/gI3JPHbM9u2jCCIumfhEC8/HRrdOPxIOY05KIhAIkJ+fj8GUxs3LR2HV9McWVhPoaY8gDEmI/Qd4PzXF4tfPBINBFFXF49WINaVRc7IQli27T5oVM2MPImT5fVjtmZglN3GJDlLSFPxqkI6WYli2wJyy90+gW2FRYehWmBtNBfRdO8Hg7RJ+vMuBFfN/fOWSA3Q76LbttnfhJ4iLvMSMlMT4AAAAAElFTkSuQmCC',
      'http://www.metacritic.com/search/all/{{IMDB_TITLE}}/results'
    ],
    am: [
      'AllMovie',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAuklEQVQ4y2NgoBSornr4H4SR2UAsgANjqEXW9AeJ/QkHxlCLywUfcGDcLkD3DrHeRbb1DLoByvIK3iCMbgCKWiTBJ8gGADWyAPEGKGZBM+AJQS8ANRkC8U8g/gViE/QCsiBQAzMQtwPxZSgGsZkJhcELJAPEgfgtEC8E4kVA/A4khk0tsgEnkAxIBuL/UEPeQdkp2NTi8sIFID4CxPJALAfER0FiNE8HP5DYD3BgDLW4kjLevECMa4kGAETOtCNo09TFAAAAAElFTkSuQmCC',
      'http://www.allmovie.com/search/movies/{{IMDB_TITLE}}'
    ],
    bom: [
      'Box Office Mojo',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAYFBMVEUbHRuKAAOSChAtLyyYICA9PzxERkOhNTVMTktUVlOqRkZdXlxmaGWzW1t8fnvBdnaKjInGhIORk5CZm5jOlZagop+xs7Dbr7Djw8PT1dHr1dfz5ufq7On58/L/+/r9//yhFN39AAABp0lEQVQ4y33Ti7KjIAwAUOPS66MC6iJgheT///ImFKd1u9NYNcXTgGTa4BlUb/9Eg5OX8dmvZq8g8fEONjOvuK1m8sbMaGhYJzOlFzBT/Mtg2/wWzYY/NFBPpU4pxMCb1eM6m7gZE/PdN3MzD2m6+fm2CXBRPoixy3zN0y4VhtSnvU+DgFEjOFmeLW9RwX4n+jPdClARXByXrNGOB97Ts8KdsE+pALDgOgsRgtK2LnJIP7sfkn9WUMq1UTlYRjeip7UcW598vz/XAKOARUAnG5Wte98o/pl2KkDgiRYtwAE83kEI2jnoHnAofh0ei6DyG3hGxghyLc06Mn0ARLWUW+DnISBlZwNeQA2wFABy7gBgEUC0cHrwd8Wra0fOBdS0gpZfoWWgQSPnAnj7JK2gA82noo6L8ilAUiVzFKDbloniEcfACqjpCXg6dwXtBYw8S/hWYYygQ10DP3mtwZ0gy6giC+MBEAXU9ATUHQIi7wgoFFDTAlyracHQdsQlQMWykzUtQOLszvHgrABOS+Ma+gi0PNurm5+A22K/As2N/wqu//D/gGv8AuMhVQ67TUDqAAAAAElFTkSuQmCC',
      'http://www.boxofficemojo.com/search/?q={{IMDB_TITLE}}'
    ],
    criticker: [
      'Criticker',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUCL10JNWIaRG8mU3tBZIlMaYlSbo9ZdZZYfZ1mgJxxiKV1jap3jqV6lauClayInbSPorqQp7iYp7qhssSot8quuce0wM25xdPBzNrK09vT2+Ta4uvk6evr8fPz+fv+//xEFJzNAAAApklEQVQYGQXB0U6EMBRF0X3LgWaUBE3m3f//M9/UOAJTbntcKz4AAOBX3u8aVyzg0a/rb22gzGNqOYwj5rojsvWiWfM07Xt0VLhtBQCi1h8rCgAA5fFMSmQHAJheNllEz2IMPo+rISY+AcC8vaYV9vuCMeRjNESwVADIvo4hQgYA4vTTCrIAAFFXLMJf35NmqcS1nzexaDjPw2Bt3WKmghmZ7bxa/QcJoVoLeA40rAAAAABJRU5ErkJggg==',
      'http://www.criticker.com/?h={{IMDB_TITLE}}&st=all&g=Go'
    ],
    letterboxd: [
      'Letterboxd',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZ0lEQVQ4y2NgoAZQMnYJB+I3QPyfSAxSG45swAcSNMPwB2QD/pODB5kBE7Pd//9f7AnGILZXk/v/ooueYAxiJzUt+r/w4n8wBrExDIBphmGYZhiGaYZh6htAsReGfjRSnJQpy0yUAAALBG7oezCB8QAAAABJRU5ErkJggg==',
      'https://letterboxd.com/search/films/{{IMDB_TITLE}}/'
    ],
    thetvdb: [
      'TheTVDB.com',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAHS4GHywOLC8TKjgdOTIjOUcxR1Y8UktEVmBFWzhCXztHYzlRZG5Raztgcn1ngj5tgItxi0B8lEN/jpSDnEmIn0aOnqSiq7OuxU3Cx8rI3FTQ1djR41Tf5Obt8vX+//xpr4P4AAAAiklEQVQY002O0RKCIBRETyJGZUZSIgrs//9lDzbqfdszs3suHPd9ngLtOC7z+D6R25Lz3AI2hX8j5weAUwLgMt9fH8B6rc7hbNPA1cEkSeq1AhSBiyohUGTBat03Jnnw8jvolCDJHpYiY1RO2qhh0HQCvWJUB2A2I7XWsr1cFaOBqK0BQZKBXuqAHySZCuu3bZjlAAAAAElFTkSuQmCC',
      'https://thetvdb.com/?string={{IMDB_TITLE}}&searchseriesid=&tab=listseries&function=Search'
    ],
    tmdb: [
      'TMDb',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABU0lEQVQ4y2NgGDTAzMyMiZWVVZGDg8OWjY0tG8juYGFh6QNhIL8NiDPZ2dltgOIKfn5+TCia+fj4DJmYmC4xMjJ+BnL/48NANZ+Aas8B9WiBNXNycqoDBX8hKfoH5D8B4mtAfAGKQeynaAZ9B+pVYgA6cQFMEGjyO6CgCdAbQlpaWqwwF2poaLBycXEJA+UsgWq+wtQDvTOFgZmZ+SVMAKjIilBYAdW4wtQD9d5hAJr4A+qkb0ATVQgZANSkAfMyUO8HkMAbmInAkLYmZADQe85ILrgLCoMVSAHzgoeHB6c3uLm57YFq3sLUA/XOBJmoDQpR5BAGmvwaKLkd6KJlIAxk70B2KczLoBiERaU+UMEFQmkAzYAHQBfxoThRQEBAExiQ5UAblwMNPAQMpFMgDGQfBIqBXFMASqGgxATE74CulyAr2QM1ygCTdTIwSrkHPhMCAEsOaD3NT/fGAAAAAElFTkSuQmCC',
      'https://www.themoviedb.org/search/movie?query={{IMDB_TITLE}}'
    ],
    icheckmovies: [
      'iCheckMovies',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACvUlEQVQ4y5VTTUhUURT+7ntvnD+NkUntlaWG5ujk2PSHkqsYkNxILRqqXQUWMgtdSIuQUfuHhBYS0SKEgoagRbs2QRIatHBSh1cTUjqTGYXo+NO8effN6943PWvRog7v53LvOd853znfJWAWDocNSin+xyRJQiwWI6Szs9Ow2+3I5/Obh4ZhgANaoKIowmazgRDCDtnDflQU4J9fhsQdNE0zAbiDtW5o8KG2djcEQcDcXAozMwnoVIfkKAJhIKHEEnwL65C4M8/IX1VVUVm5A5HIRTQ1+c3MbJvXhNnZj7h7/wGS8WmcfJ/B9lUNsaZSkI6ODsOqQpa3YXj4JjweD7LZ7G/CzMNe7MLKl6940XoGxSsbiO0rQ8otQNB13eSqqjl0dZ2H1ysjxzgKrFTLiCRCXduAcuoSSpbW8KTZizkn641KCwC89KrqXThwcD8SQ3fwuuU0FmPPIbndLLoAlrgwiG8vJ9A8eg3lR1tAM2ugOgPg2bNZFWVlW1Ek2qEufkfmTQIz5/rx+eEzOFyl+HR7FOlHT1HTcxby8WOoLq9AllXMk0v8ozMk3mGIBvwj/SA2CamRx0j2DcPQKGaH7sETbEbdYDcjRM0p8cQ81qTAJ5BOp5FjVPTsD9Tf6MGWQ37Q1XUokevI5zTU3+qF6HYxgDySyQ8spgBiAnBTlHcYH5+Ay+EAKbKhLtqNvKqBrm+g4kQI3lArK7cQPDb2yhwxjxVlWY4WaOiIx6fQ3h6Cp6QYUmU5tOUMPIcD2HMlAgfLTtmoe3v7MD+fMqVsii8YDBpcA5wGb2ZV1U5Eo5fR1naEKdP+a5AU09NTGBi4isnJOJxOp6la8w0EApsAlqB0VmogsBc1NdVMyoT1Z4FV99bkzO+NqQ0WzGVOfD6fYUn5T+NAf71MlrjYmseYO42NjYY1jX8xK7uiKOQns5Rn5uMgMxgAAAAASUVORK5CYII=',
      'https://www.icheckmovies.com/search/movies/?query={{IMDB_TITLE}}',
      'Couldn\'t find the movie you were looking for?'
    ],
    episodecalendar: [
      'TV Episode Calendar',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAflBMVEX99PrgMZr74/HdHZDfK5feIJHeI5PhOZ787Pb98fjoaLXhNpzmWq7iPqDui8b51uvyqtXsfr/lUqr1vd/75vP86fThM5v62+3+9/vgLpjcGI3eJpT63u/qc7r40+niPJ/0tdr3yOTnX7HparbvkcndG4/cFYz///8AAAAAAACMev7qAAAAAXRSTlMAQObYZgAAAERJREFUGNNjYCAINNAANgF1JAAVkFBTE2NSU+OFC7CrQQBcQBVdQA7CZ4YLqIuA+FwIQ4GAUU0Gbgshh8F9gN03WDwLAPC0HDHwivrOAAAAAElFTkSuQmCC',
      'https://episodecalendar.com/en/shows?q%5Bname_cont%5D={{IMDB_TITLE}}'
    ],
    moviemistakes: [
      'Movie Mistakes',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACO0lEQVQ4y22RS2sTURTHs3EhdCkIUlyJoHUhqEs3bv0GRRCk4CdwoVLSZNI2aTptg8iUlFa70NlIqIvmMS0znUknhaS+IfThg8SaTJpMRoKmdiad47mZjJ2xc+HPvfd/z/2dc8/1+XDk83Axm4UWqoLa5/nKIPE3NuA27jXiS9JRTRSVmz6vsb4OQ2trALZ4Xi0QX5Ig5fRTqa8PPQGYYcENOIBcrnAG1yWnv7JSfe0JEEUoOAOJVlf3Iui33QD1+4nLm5vQh4Ff7CCO03Srip+qNesmkQVtgdf7z+Fh3crQBlFsPiNrQTBxDZBO17B5pmInSCTYgf/ffwkDDXKYydQBO385mQRYXra0tFR8guc7PG/tFxfLD4aH4QrLfuzrAmQZbtn0TEZpBYMwEAgAEI2MAMRiygImeceyAH6/5ZGZYbaGehUYjwRBx5INBJTejI7CPRJki6Lan2T58C1NH3sEMDW1F+8CBKHRz3GVGxxXvS7Luf7xcXjpBASDRjORUO84PaJwuJH3/NKxMShbQWZXgUAHpqfbrFV+xwE+3JEk+vQJAPagV7quowyyDoUOOgRA01XN7gOeKXNz78+6Ls/Pw1VHhnIk8id3XLYJ8fiHx46n/Z6ZKV1wAaJRuO8AfJ6d1QbtjLg/YpjseWyy2QPg0+rXXICJCXhhXwiFtCLxKOrfb/zY3fWdwh5t20kY5ttdFyAc1tIU1ahQVLNK09tJq6pfTylK3Y9Gt16R/eRk6znG1NCrxWJF/19hVVzTzfSONgAAAABJRU5ErkJggg==',
      'http://www.moviemistakes.com/search.php?text={{IMDB_TITLE}}'
    ],
    imgur: [
      'Imgur',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA8UExURSoqKmm2FIbHRmCxAT8/PTIyMSIiIicoJSsrKjIyMXzANnS8KTdEKU5yJFuQIHy0RF2iCEFWKV+CPHOeSaqlM1cAAAAKdFJOU+r///8Sh//+34hnFoC2AAAAaElEQVQY02WP2xKAIAgFqUy0xOv//2tqR6fGfQF3AIHUaWhirCLL+gNbMsjga3kLLpeSXcuoCwl7JaQhUn9X4yDyBeQV7G/gGWIDEFqGQIt28ejEMVSnbuL8ttaI94LFltWX45T9n/8AT98GJdi3gDIAAAAASUVORK5CYII=',
      'https://imgur.com/search/score?q={{IMDB_TITLE}}+{{IMDB_YEAR}}'
    ],
    wtm: [
      'What the Movie',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAwASExEdHhwnKCYwMjBAQUBPUE9qa2l/gX6anJmqrKi+wL3O0c3X2dbg4t/7/fqY0FSkAAAATElEQVQI123NIQ4AMQgAwZVNEP0y/gRfwVfwJSRJxZ0orrdq3MKd6KPiwHRza6QpIBl1UI1RuwJg7FoLgDdtAxBpdeAN85n9EP9Z8wHGNSSyvcOg2wAAAABJRU5ErkJggg==',
      'http://whatthemovie.com/search?t=movie&q={{IMDB_TITLE}}'
    ],
    mubi: [
      'MUBI',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABy0lEQVQ4y32TTShEURTHD2EhIVEWFiwssLCYbChjQVFE8rUQSmYxhTQz771732iyIKRmaMZ9X8rKQrG2sxELygYbURRL+ViRr/PuPGZu5rl16/Xv3v+55/c/D8BteSEH4nIzMLle0NcCVaArrRDpL3C9Cz5PLhj0ADbCX3xrdInrTB4Bi7xzzaQ3sOwvz2ygBbp+L9vbIp8QaS8Ei14JukHCmQ2Y1CYcNMkbRDrzwVDOBZ1JQbcmssBSt53q79jzFFd1qQPNnpOm6gl/1b8rOl0JK75SQbPhxULV+JXtHBotBp1uIrQLMJUY9NfmJTmQYdDJKfa5j7qHa6uTFfiCXdxnqM06wBRN6EtTZIhLdWCoHykG6h2vqJM9kY0yCFj5UBB1sgWMDAiavecny7DyvViMLCAYWRENpCGer0Ee01I44q81VT0VIb4wITUmiTM6hhzWIRHq+YWVkGrwYhSji3BOPwPGyDSaJ4AFWv5PYNFXhPGNAgt2p4jbxjNeNJngQF2XHZVBLwUufA7S2jXpkxNnplEmvX8gmuMlaHorQqRzLqMcbBIvqy98PkxyLAIP+d3bsP9Ak75i1QeE1pdsYaoB27nmCRjKjm36DSPnHFZXIXO2AAAAAElFTkSuQmCC',
      'https://mubi.com/search?query={{IMDB_TITLE}}'
    ],
    listal: [
      'Listal',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEURExAnEhIcHxJNEQ8mHxVGFxNoEBEbJSaADw4jKhddHhGiDBDABg17HROPGQ8sNhjpAA3dCwslPkMtQCOyGw8wQxcvWmFCcVo5dH4/iplQnItForVRucpgvK9awdOV4DHk1f9XAAAAcElEQVQYGQXBQYrCUBAFwPqvk6ggCFnM/e82e2Fmp6bzrRrg9gO/JwIAEFwAYMG+TgAWlA7cz/W/wx4NtmWWsHGAN1eh9AEmLS6lgWaIB2/gwyrK+QQmc0RpwDFYskcDfBjZ+AOYJKVfNqCplAZw4gsc+SJZ/7PhIAAAAABJRU5ErkJggg==',
      'https://www.listal.com/search/movies/{{IMDB_TITLE}}'
    ],
    hancinema: [
      'HanCinema',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACaklEQVQ4y3VTS2gTURQdxGWrUBG0LkJrd34oiAvtVosIVsWAVUFwp3RRsG5cFEXBlbUUDEbBgi4qBUVrF21K+lHMNJ0kM0maSWPTaIS000iaz7T5QD7H914m02mwFw4M98099717z+E4LSqVionAShAlKOVyOSjKOuLxv8gXCqA57Yz+Y+KMQRKdBCq0SKczcLklSD4/JK8PgltEPp+vHVMyldYYO+vFGVWFW/SCnxfg8kiESISDfPv8i6C3qiMxUQIrDJHY2IC6uYlkKo1obBV/VtcYaTKVQjqTMf5KSayUIGpMbm1l8WNmDjM9feDPXQLfeRnT9x9CcAookFnUEUQpQamWoO+cHv0EofUExMbDEPcfYZAaDkE4dhrfJqZQLBbhdHlQLpfZYDkjo+T1w3nyDMR9zXox32TCg/Yu9Jy6hrGuWwiFIwj9XIayHmc1OgFltL9+C5F00zsToo7zveBuDoK7MYiWq48xZ7MjmUwhIC9tE4ikcz5fwFT/0x0E3w+0YG/3c1L8oorrAxgeHUc2m8PEpJ3cJFwlcPALyJH3f3zzHkJjs9791dGzWvcqwR6Cz5OzSJEN+f0BOgOwIS5pb+IFD8xX+mBp68Cj4xfQZH623Z2gvdcKWQ5iJRJBjKyXDZGugl6JJ2vKZFS8/DCOhttD7M16cfcADt4ZwsiYjcnaMb/AtlFbIxPSMplumCCRSGDkiw0X+4fReteCtnsWmJ+8w1fbLBMUDVpsFJJJkyUWA0HIwRCTbCwWgxyQGRRFQalUqheRqpvKaKY14kAH72Q+CK9Edpjov2bazc5U0r9+R3X57mbnf8brH/ocK4DKAAAAAElFTkSuQmCC',
      'http://www.hancinema.net/googlesearch.php?cx=partner-pub-1612871806153672%3A2t41l1-gajp&cof=FORID%3A10&q={{IMDB_TITLE}}',
      'No Results'
    ],
    kinopoisk: [
      'Kinopoisk',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJlJREFUOMutk9EJwCAMRDNKR8tUDuES/ffHQfwouID1pJEQ2lK1wgMJd1eTKjnnyMCVvVIMqDHZpYxbJd4YLdBsNgDm44NZOHrIFdC+7L0vOecG9mJ4qEcJYBFCICul1AOwlwWNOgmTHthEwE66NxwPYmBbuKsDehtWCKHxpvk3YLaF5SEu/8bpiwTv0lXWAcOPSXw0+pyt/gS3Kr6Pq2iRXAAAAABJRU5ErkJggg==',
      'http://www.kinopoisk.ru/index.php?level=7&from=forma&result=adv&m_act%5Bfrom%5D=forma&m_act%5Bwhat%5D=content&m_act%5Bfind%5D={{IMDB_TITLE}}&m_act%5Byear%5D={{IMDB_YEAR}}'
    ],
    cinemaoftheworld: [
      'Cinema of the World',
      null,
      'http://worldscinema.org/?s={{IMDB_TITLE}}',
      'No search results for:'
    ],
    veehd: [
      'Veehd',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABTklEQVQ4y6WRoY7CQBCGJympQaAQV4WqICgMqhdqyJE0KCoQCBya1EMQJKg+wb0BEoNCYUifoLY0p2pKgrrkv91Nptnbo4LcJF/6z8w/ne2WgiCYCgoBXkTOTGg8HhcCmCyXy1888whuNBqNoDOfz3E6nXC/35GmKa7XK8qyxOVyQRRFMP3k+z6Y/X6vBmXEcQwiUqzXa3AcDgfoM+R5HiRhGEKP4XBYvUByPp+r3m63A8/RYDAAs91uK9Nms3l6guPxCH2G+v0+dGazGZIkUeYsy9Q9PB4P5HmO1WoF00+9Xg/PkBe0WCwq6nzkui7+A3U6HQSf3wqpzZy1Sdebqj45jlMVpTZz1vof0fvUbrdrt+g9qRm9Rq1W688WzvWe1Ixeo2azWRWkNvO6071131WfbNsuBGqzfDKc69/ONBoN9t3IsqyJ4EuAF5EzHz8jKv73k0dNqwAAAABJRU5ErkJggg==',
      'https://veehd.com/search?q={{IMDB_TITLE}}+{{IMDB_YEAR}}'
    ],
    surrealmovies: [
      'Surreal Movies',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAgAaHBkrLSo3OTZBQkBWWFVjZWJzdXKLjYqYmpeqrKnAwr/T1dLg4t/s7uv9//tJZD0wAAAAdElEQVQI12NgEGQAAgsgtm1gYIh6CmToPNP5t/8RSPj/vnfvBYA00/+f/WAGw6XIdhkQzVBgvYwbzNhz/9xtMKP///zfYEb9QblfIJr5//lf/yeAtLt/tWpLAAlJJTAcBKvhXMS1EcwQ//9/IZjB6GIMtAEAHiYl2rp5rQoAAAAASUVORK5CYII=',
      'https://www.surrealmoviez.info/advanced_search.php?simdb={{IMDB_ID}}',
      '0 Movies found matching search criteria.',
      'Forgotten your password?'
    ],
    kinox: [
      'Kinox.to',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABQ0lEQVQ4y6XMXSuDYRgH8JsRIzYnPoUDh7KkpCS1edtKVmpZLUqkOZGZA452PPYSIQfL6mkemzTk9fBxprC8nMjH+HvuK4+u7ramdvDreul/XaLDt4JaCKc3jFoI58QyaiEc44vgwuksUXfpszt4onGoedE+ugAuVbgl1rxxeILH0idVNSuJNvc8uFThhsg+epCjY1nVnEW0joTAJU+vyfq+BuP1g6qa4UTLcBBcUr+iQ0swtgs1wwn7UABcQr+E8fKOyF4WsUye+u7ZVag507dJE82DM+ASuQscFe+p73SHoD8YNMv+N/Nk8gKok0TTgB/cTq5IrNk1F4Hx/Ia1dEbOxya7dUwPGvunwG1r54TvAltxWfP88O9BQ58PXJd/iSj7L5Oj7AObaxL/MF3umB7U946hipLJVvlBjwdVbFY6ln4AEEYVYRiE14MAAAAASUVORK5CYII=',
      'https://kinox.to/Search.html?q=tt{{IMDB_ID}}',
      function($dom) {
        return $dom.find('table.SearchTable tbody tr').length > 0;
      }
    ],
    movie4k: [
      'Movie4k.to',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEUdHBuRkJBcXFtGRkXl5eUuLSx2dXS+vr79/f2oqKdtbWx/f35TRz6aAAAAb0lEQVQI12NggAFm0wAgaWzAwO4iwMDA6FLAwN7hysAQ0gFkdDYxMGjMADK63BkYSlYAGU0lAazuGkBGc0YCW7cFiGEygd0ZzGBvjSgAM7i7d2wAM5jdSwzADNaK9gAwgyGjmwHIYFZlCAIiA7grANJYHWA/QxVTAAAAAElFTkSuQmCC',
      'https://www.movie4k.to/movies.php?list=search&search={{IMDB_TITLE}}',
      function($dom) {
        return $dom.find('#tablemoviesindex tbody tr:not(:contains(download now))').length > 0;
      }
    ],
    ixirc: [
      'ixIRC',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAQAsAQBAAABPAQARExBhAAJ9AACSAAAfIB6dAAC0AADDAAAtLyzSAwDlAAA2ODU9PzxGSEVNUU9ZVVRiZGFca2tzbm1xc3B9f3yDhYKOkI2pq6iytLG6vLnU1tP6/PmPXyOgAAAAVElEQVQY073OiwFAMAwFwNf4V1FR9Ukq+29pCm6CA35ROQDMp8qJtZSAlipHKUuCBavjBU9z5/csZvfyAICncRr2LOshsJ4VHflm4O1iaIgq/SfRF0w1BK4hjJ+2AAAAAElFTkSuQmCC',
      'https://ixirc.com/?q={{IMDB_TITLE}}',
      '<h3>0 Results for'
    ],
    filmaffinity: [
      'FilmAffinity',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADFUlEQVQ4T42RaUhUURiGj5QYqLlUk4kpRJGBgUKSGbhkpWK5NkaWWtgPTR0XslTMUMLIHB2dZshlCvrhlJQtaJu5JIUtmruW69wU3ENHTFDueTv3ThhEP7rwcM75lve857tkuN7RXN/ioEGHnW60xlbnf9CO02qrOQDcA62Ws90s4VydXbh3zc1iLCc7m7Ox3qQ74uX9Ta/Xh5HFFruHtMMRGI2mY88lGOx8ilUeKCqQw3aLBD4enujr7cPP5WWkJqdAYmmNE8HBmJ2Zwfz8/BJZ+WTL850uqzx3haLHlQLjNPeanFqYWdC9e5zo1NQ05SmlssRkSgihoUEhlInxPE8REBDYS2irDeU7nABdLObe7sDSbCuGh8cQExWFrZZWuJqVhR9zc+ju6mRuPLDT3oG5K2AXAdrK+zrCt24D3+kMTGRh8JE5ZOe80falF4sL88jOSIeVqRmiz0RifGwMczPTOC2VsmdY0dSkJOgXF3Vkvywd+xMvwi0+FvviM2DqmwT7SDkO5TzGgfRKmPilY71PKnadV+JoXi0c427DxPcyJZ4yOCVUDBASrIIBNUigklEM4n8T5HAeW/NBwlk8VGmIBTBCWT5cRRkgQUX9hJwohhGDHC+Ae2YV7jX1o7SuB5qGPqTdbYSQjytrQHldN9wztOwCOYykxVSIM74aBKTs4HcD0crXwmzw5kMf7tV+RK76KTZEqLEi/Ff2VbxsZ3XXWX3JvwTyEVnySiwsevwBceWN2B5bgQjFSywtLaOs+j3GZxaw+4KGWS+kouu/BaKUBoG2/u8i3ikatAxMio0y9QsxF11YI8yGij1/P+Gsqk4scksoBXG+BPtYjXge4ibROzIh7uvbR7Ax4hYloQpBQByiwc6xAnhmVeFz9yjckgWbckjzn+FJUxe8ksohiVIh7U4Dquva4BBTSklI0ZrACmNVEDI+WUKtz9yixlIFJWEKan5aRS1OsYEFyVmDgq5j098i5MOLeaGe0S0IVP6eKGtiq8GagTDF2ll0+ScvCAhrpiBgylAzRhg6BvcfDDGyGca/AHNTYBXQhFjjAAAAAElFTkSuQmCC',
      'http://www.filmaffinity.com/en/advsearch.php?stext={{IMDB_TITLE}}&stype[]=title&fromyear={{IMDB_YEAR}}&toyear={{IMDB_YEAR}}',
      'There are no results.'
    ],
    bluraycom: [
      'Blu-ray.com',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEVGmt1IneBKoOJMouNNpORPpeVQqOdRqulSrOpfqeNUrOpVruxXse9ZtfFdufR2uux+wfCFwe2Cx/Sby++czfCkz/Cg0/Wo1POr2Pes2vi73fXK5fnV6vno9P30+v3///8V2ZdfAAAAf0lEQVQYGQXBS07DQABAMWeYQiskPve/IYuWBUhAOnnY2wuIpKMJz+j4vS81MR/BZb+WQTjWwemchmC/Xe88VQNgbfypGTi9b8P+VU3CQKsy5GD93G3n1zQS9tvHNxcZAiykmXXi4TKfOTAFpzd0i7kUWL+fO7ZzpRJhVCoR/AMNol6wavG87wAAAABJRU5ErkJggg==',
      'http://www.blu-ray.com/movies/search.php?keyword={{IMDB_TITLE}}&yearfrom={{IMDB_YEAR}}&yearto={{IMDB_YEAR}}&submit=Search&action=search',
      'Sorry, your search didn\'t return any results.'
    ],
    myduckisdead: [
      'My Duck Is Dead',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAQAJDAgQDCAiHi4hIyE2ODU+PEpQUk9oaGaMj5Clp6S7vLvU1tPi5OHu8O38//uJC6zlAAAAX0lEQVQI12NggANGECEAxOwBQFwAYixgYOByAEldjWipBkkz7Xv/96UCiNH/7t03EIN93bt3N8GK/7x7dz8ApHhV34uVYBMl5+yaADF77isBCEOiBWobswGUwWTAgAQA1UYaf7VZ5TwAAAAASUVORK5CYII=',
      'http://www.myduckisdead.org/search?q=tt{{IMDB_ID}}',
      'No posts matching the query'
    ],
    vintageclassix: [
      'Vintage Classix',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAQAJDAgQDCAiHi4hIyE2ODU+PEpQUk9oaGaMj5Clp6S7vLvU1tPi5OHu8O38//uJC6zlAAAAX0lEQVQI12NggANGECEAxOwBQFwAYixgYOByAEldjWipBkkz7Xv/96UCiNH/7t03EIN93bt3N8GK/7x7dz8ApHhV34uVYBMl5+yaADF77isBCEOiBWobswGUwWTAgAQA1UYaf7VZ5TwAAAAASUVORK5CYII=',
      'http://www.vintageclassix.com/search?q=tt{{IMDB_ID}}',
      'No posts matching the query'
    ],
    rarelust: [
      'Rarelust',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAABIhf//+/AzBqZVAAAALUlEQVQI12NgAAEt0VAwEQAiQhgYRBlBBEMIkIsgwGJAJUDCAaaYFS4BVAICAGPrCMvSJcy9AAAAAElFTkSuQmCC',
      'http://rarelust.com/?s={{IMDB_ID}}',
      'Nothing Found'
    ],
    avaxhome: [
      'AvaxHome',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAAAAAABxbm3U1NPDw8MPDQzx8fLi4uL6+vr///8pJSJST007NzUdGReLiIeqqahjJly6AAAAAXRSTlMAQObYZgAAAIVJREFUCNdjYEAARiFjZzBDVCyt2AEkENjmPN0FJBA4bXWnC1AoauG0UxUlDgyMt09lFqcVOzPwHjq6o3NGuQsD776zUZs824CM/XvvhgZ1mjAwrte6dTf0pzEDQ9Dvu5+u7kxgYFj6bld96M4CBgbeIO09F3+A7Fq68Gx0Ath2QRkVBgYA6yIs21PYRWMAAAAASUVORK5CYII=',
      'http://avxsearch.in/?q={{IMDB_TITLE}}+{{IMDB_YEAR}}&a=&exact=1&c=54&l=any&sort_by=',
      'Found 0 post'
    ],
    xrel: [
      'xREL',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAAAUFBQrKys/Pz+Hh4ednZ3/lgD/ogCurq66urr/uQD/wADJycnV1dXo6Oj9/f0GGqvHAAAAdElEQVQI12P4DwUMIOLdu3dgxr+bHXPfAxnvXhowMJ9j+P9mZgvX6g3zGP4dZlIQYNjQx/BvwgZu7l0LQIwFXAwMIEYTVwF7WQJQTUMBGwNI178JCWwsEXPeM/y7zKRgeQ9k8tuTM++B7fr37t17mKX/kRkAn3VZRBtqnu4AAAAASUVORK5CYII=',
      'https://www.xrel.to/search.html?xrel_search_query=tt{{IMDB_ID}}&lang=en_US',
      'Sorry, your query did not return any results.'
    ],
    srrdb: [
      'srrDB',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAG1BMVEUAAAD/mWbMmf//mZm7u7uZzP+Z/5n//2b////v25rHAAAAK0lEQVQI12NggAFmYwNBQfbyAnwMOGBLSwgNZVJSwMeAAxYXh44OAgwYAABKGxMhLQ3j1QAAAABJRU5ErkJggg==',
      'http://www.srrdb.com/browse/imdb:{{IMDB_ID}}/1',
      '<span>0 results'
    ],
    trakttv: [
      'Trakt.tv',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABZ0lEQVQ4y32TPUvDUBSGM3TKbwiIJUhxLJ3EQTqIhFA6ODgUkSJSipQiIqWIdO7UUULp4A9wEOfi5CChgziE4uBYhPgLCvE9+l453kYDD9zknue9n3Ec60mLfhlcgxg8kZjfys5fDzpdMAb3YBfsgVMi7R32SY2bJ09BE7TBAmQ/rPv91EOf5x+i3WStqwMmlMe/xG+5B/EYhOADRAyZGLkC7jjyf3IAEpCBNp2KBERc87slX1jyM2VhgX5xIgmYcZP06Ofpmr+Fwj7lFyUbJGDm8Ij09M/ACdhHiMgPObJZRmwCWpS7lGugA+oIkSW85gS0dEAV3Cg5AEd8NyFzK6BqAkYgBLdKTsCSszAhgQp5wyaKM5KAEi9GSHmu9kOH1BgiR3lAp2TuwhD0WJzl0FUhG6wd6ptY4BKuvqZbxLGthsiom6yR2oL9P0jIADyCBthmWJ3tBvsGK7IV5IFLrjEhU37z7PpPB+SQTEVjedUAAAAASUVORK5CYII=',
      'https://trakt.tv/search/imdb?query=tt{{IMDB_ID}}',
      'We found <strong>0</strong> results for ID'
    ],
    graphtvmatsf: [
      'GraphTv',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAAAAADFHGIkAAAAb0lEQVQoz2P4jwMwkC2xMuo3iPoTvwhV4r0QQ9QfoHgUg9B7VB1nBBnCfv+JYeA/jm7HCX6GqCgG/hNIdmyRZkADMlvBEjIMGEAWLMGA6mQGn4/eDFglvD96YZcAAVobRQsJnEGyFUNGdhslcY4BAIIYn8HozFUsAAAAAElFTkSuQmCC',
      'https://graph.matsf.cloud/tt{{IMDB_ID}}'
    ],
    kereses: [
      'Keresés',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAh1BMVEU2N2g3OGg3OWs4PW85P3E6QnQ8Rnk9Sn0/TIA/TYFAT4NAT4RAUIRAUIVAUYVCVIhCVotDWI1EWpBFXZNGXpRIYplIY5pJZZ1LaqJMbaVMbqZNcKlPc6xQd7BSerRSe7VYicVYisZajspcks9dltNgntxhn91hoN9jpeVlqehlqellqupmq+tAfB2qAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+ELGAwHKxlWugUAAACQSURBVBjTXY/ZDsIwDAS3JQTKFcJZ7hsK+P+/D28cgYSfPCPZXqMA5FtAATd3bE/TEBZPBUSJygewrgooe6WKAXxd794K8Huvoo8VBxUQJPyEAkfl9ehieWt4Bagu1b2VVmIrChTNLDp0JuNjEkjBhlhbMOSlWXCpnc2CZy1YFgxm0UcmGN2e27TPFHzu//0Plk8YeRdoW3MAAAAASUVORK5CYII=',
      [
        'http://www.filmkatalogus.hu/kereses',
        {
          szo1: '{{IMDB_TITLE}}',
          ment: '1',
          keres1: '1'
        }
      ],
      'Nincs ilyen film'
    ],
    movieparadise: [
      'MovieParadise.com',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABdElEQVQ4y33TyytEYRjH8eO6UdSMu2IxU4wFG7GUWymJUra2yl9hMyzcS9SUMllYoFhYsHDZUMTKpSxMCRtyFzZ8n+k3dZxm5tSn5rzP87znvTzjOJ5nKBqrxzQu8I0fXGEODU6qh2AxpvDrKtoQ+/2l2DxKvcUlWFXCHtqTfKAVO8qxScsTgSyMK7ACf5pV+rGu3Ank2mCdBmzP1UrMSFKch34M4FQ19Y4OzF7G0nzZVjmCa7RgWDWjFrzEEzrSTDCogld0oQ2POHZ04vcIpCiuwZsmOEHItooY3t0TBFVQiCga9b6r4n1UaqxWE7zYyzmetawADlRg19qn32fwuVbViQccOa7mmXR1YuKUb+0rqPJsK6x4OLFH7zXafR9qvMdTHLTDUyxkA5muq1yzllZiWfya/hf7EEmsON5IChRgS4FtNKu9s5FvvY8mLCvHcouS/Zkiriuzvp/FDDbxiQ8soCJdx3VjETeayNxhCb3Icdf8AfErxDzVutz8AAAAAElFTkSuQmCC',
      'http://movieparadise.org/?s={{IMDB_TITLE}}',
      'No results to show with'
    ],
    uloz: [
      'Ulož.to',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABzlBMVEVwJnNwJnNwJnNwJnNvJnNtJ3OYF3yeFHxwJnNvJnNwJnObFHqdF4CVG4HGAX68B3+KHXubGIGVG4GVG4GPHoHKAX7FAn/HAX/BBH+tDHvFAn+XGoGmEoC1CoDFAn+VG4GMHX3LAYDFAn/HAX/BBH+bGIGVG4GWGoGcGIJvJnPFAn68Bn+zDIDDA3+ZGYGpEYCeFoCUG4FvJnNwJnNwJnNsKHLIAX7GAX/HAX+VG4GVG4GSHIFuJ3JwJnNwJnNwJnNwJnNtJ3K8Bn7FAn6+Bn+dF4GVG4GbF4BnKnJvJnNzJXSHHnq7B3/GAX6vDX+mEn+eFoCWFnl2I3THAX/FAn/KAH6aGYOVG4GJHnyUG4DGAX+yC3+NHX2VG4HDA3+nD3ucGIKWGoGVG4HHAX/GAn/NAYCUG4GeFoCsD4ClEn+UG4GVG4GVG4FwJnKdFHuYGYCXGoGQHH92JHVvJnNwJnNvJnN6InR1JXV4I3STF3i4B33BBH+bGIGPHX+AIXl0JXTIAH+UHIGVG4GcF4GhFYG3CYC/BX+dF4GlE4C7B3/ABX9vJ3NyJXR9IniMHn6yCnyMGnd1JHTIAX/JAH+qEICVGn94JHaQHH90JXWRHH+ECSCrAAAAAXRSTlMAQObYZgAAAMNJREFUGNNjYGRAAYwMJcwsCC4nVwlDaWkZNw+Eyy9QXlLCUFFZVS0oBOKLS9TU1tUzSEo1VNc0SsvIygHpJnkFoIyySnNLa1t7R2eXqhrULB1dkCo9fTDHGESYW1TXWFqBWHYMJfYOIIaLK1javoShpNTLG+aMwKDuEoae3r4alWAQN1y1rX/CRIaIyKaa6klR0TGxQHpyXDxQJkmwum3K1Gl1tTUSyRCt6Rk1TdNnlM4Q4Id7Kjtn5gxkTwJBYRGUAQCvNDSIcYvIygAAAABJRU5ErkJggg==',
      'https://www.uloz.to/hledej?q={{IMDB_TITLE}}&type=videos',
      'nebylo nic nalezeno'
    ],
    imtdb: [
      'IMTDb',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiBAUALjkBBMf/AAAAQElEQVQYV4XOCwoAIAgDUHf/Q1ttFmpEQ6Ke/cxbzK2EIJ0j+wLWacp/EKuY11euf+wgAYAGq6gFtOkBvCMdyRmFQJ95cUJKuQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wNC0wNFQyMjo0Njo1NyswMjowMOXYsugAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDQtMDRUMjI6NDY6NTcrMDI6MDCUhQpUAAAAAElFTkSuQmCC',
      'https://imtdb.net/search/node/tt{{IMDB_ID}}',
      'Your search yielded no results'
    ],
    justwatch: [
      'JustWatch',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABpElEQVQ4y6WTy0sCURTG/SuyVj03+Wj0zthkmqlTCpqSqVlpWqlRRBDmIoiIqFVrkdoF1aKICgqCjBYRFYRBbVr32EW0adPqa2Z8RDDEhIsL9x7u+d3znfNdhbK2ubaqTpXj15eyXg05S7gr5Ai5CnEjM1EClFOUXk4O6XCyxiIS0KO6QX4litIhldDj8bAdx1kjEmGCaIiWBSoDAt4W9Hkofq9CtJ/GyxmHiy07HN1/V1QGzIzpkVlgwLBaxEIEDwc2pCdYeFw0bvdcGBlqQ/VfgNlkQcLdrgmjgwSWTkqMO7sJPm58eL8OYDphgsdtkAYITZyfImhSazDcT/B0ymF9xYxgL4PsshUUQ0FDKHzmQ8htuGE0638D4oM6zE0SNKo0fAMJnnMcNlY7MOA3ILNkRQv5AZxv9sBsIdIS8jtmxMM0ujidGHcUJbxdFST0elqlJQhjzC4yYNu0YgX3+zakxll43TTy+y7EI0bJaZQBQS8FX0+hcQLglR/j5bYdTgeRN8Z0UcKRaCQasQEaNXKMVLLyeKRg5bD/n1au+DNV+p2/AWWoo5tG2eI6AAAAAElFTkSuQmCC',
      'https://www.justwatch.com/us/search?q={{IMDB_TITLE}}'
    ],
    ofdb: [
      'OFDb',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAXVBMVEWLrJsAAAAICAgQEBAYGBghISEpKSkxMTE5OTlCQkJKSkpSUlJaWlpjY2Nra2tzc3OEhISMjIyUlJScnJylpaWtra21tbW9vb3GxsbOzs7W1tbe3t7n5+fv7+/39/durR4nAAAAAXRSTlMAQObYZgAAAJdJREFUGNN9zrsSgyAUANG9qEQFFeWlGPj/z0yTmaRJtjvdwu/KYdby5WxNSqV9PLmzk0cDuPxWrtnZKKIKXPNuB7vZrbulWzJ1tNRJm6SG6q8cif0Ou86zPrTrY2brPIT+PnLwsgaY1AFxDIMYP/obBm0hWyMyBX8CDxkzbXeiXDwB1l4thdpCSk8A/KJsBGp9L7d887cXwiQI7Haln38AAAAASUVORK5CYII=',
      [
        'https://ssl.ofdb.de/view.php?page=suchergebnis',
        {
          SText: '{{IMDB_ID}}',
          Kat: 'IMDb'
        }
      ],
      function($dom) {
        return $dom.find('i:contains(Keine Ergebnisse)').length < 2;
      }
    ],
    omdb: [
      'omdb',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAw1BMVEXQAABMVUBJVzxQWD5KWkNQWkVPXUFQXkJTXUdVXUNWYEtTYkZZYUdbY0hUZU5YZ0paaUxca05gb1Jfb1hicVRkc1ZoclxndllreFVufFlqflpvfmFxfltxgGNzgV1wgWl1hGZxhmF3hWF4hHN4iGp+iHF3jGZ9iXh9jG5+jW+DkGyCkXOFlHaDlXyIlIOMk4mUoI6YooqbqJaZqpGss6izuKi6urG3vrO8w7jR2c7d3dTY4NTu8O3x8/D09vP7/fr8//vLkyKIAAAAAXRSTlMAQObYZgAAAJ5JREFUGNOFj7EKwkAQBd/u3amgpQFBK0EFCYj4/9/gBwiCWNoIYhJzt/sstLFyymGaAf4hAIBDXxgGx6+o2WYpJBjjBYJ1hpHiRnNOT7LtHFVShXt/dkZV+mycgmhMkxUtaGcIEBFCGCzfFXAnCSGEVNUhrPVPYM+c54KFMVVJ4P21KV4L9rdiBtLMzEeNAFhq+zIyhu4B/o5sdvjPGwnlV+zcaSreAAAAAElFTkSuQmCC',
      [
        'https://www.omdb.org/search',
        {
          'search[text]': '{{IMDB_TITLE}}'
        }
      ]
    ]
  },

  // tracker
  {
    kat: [
      'Kickass Torrents',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACEUlEQVQ4y2NggIKkSGvx6V3RH7OTHPNgYmXZ7svnT0z4jixWkuW2oLsu5D4DOqgt8j6yc0X+fxCe2R3zZdHkxF8wPggvmJTwc+WstL8wfk6SYzlcc0ywmdCqWSn/ti3N/k8s7q4Lego3ICPOpnzTwvT/6PjRnWP/QeD96/sYcuvmpv6PCjQRgvgrw2nf+rnJ/0F44/z0/4e2dPzfv7Hp/88fX8AGXD295j9MHhknhpvHgA2oyHG+smpm3H8Q3ra89D8ucHzP1P8wdSCcGm3RAjagPMvh2rIpkf9BeN28zP+n9s/+//LpNbjG+zcO/X/76t7/rctK/sPUgXBypGkH2IDsBIt9CyeE/EfGd68fBGv+8un1f3Q5GI4M0Id4ISZIv2Fut/9/ZPzs4UWI7TeP/keXA+HpbT7//d00IIHo76YuO7nR/f+MNi84fvX8NtiAGxd3g/lr5+WhyJekWz5HSUhZsUY3pzS6/ofhm5f3gg349+/v/+/fPv3/9OHlf2T5cB/NBhQDfJyVjDsrbP/11zr8B+EFE2P///r5DWzIu9eP/i+fmfEfJleUYvyOARsI91ad01Np8x+G5/RE/F8zv/h/f40jXKwh3/yvt6OCHQMuEO6jsq6t1Px/R5kFBq7ONv7j7SgfxEAIeDvIJRYl6/1oLTb9D8OJIeq3XW1kZBlIAd6OssXh3or7XK2l9XCpAQB9e+3AkPA7JAAAAABJRU5ErkJggg==',
      'https://katcr.co/new/torrents-search.php?search={{IMDB_TITLE}}%20{{IMDB_YEAR}}',
      'No torrents were found based on your search criteria.'
    ],
    pb: [
      'The Pirate Bay',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUBBAAbHBonKSc+QD1QUk9cXltvcW6ChIGPkY6ho6CusK2+wL3P0c7a3Nnr7er9//yio7pYAAAAeUlEQVQI12P4DwUM/68YA4ElkLGAAQhYwAxGBgZWEEMn6upyMMMuUOk4SGoCSA0zmCHAxMD0n+FYA7MjqwFQZEPFrJUzV61rZSgwjjj///V0YYZtlomMhsLBSgz/GE0iSpQToxn+ib3///91wHmG//tAdl+5zwBzBgA4/kVfY3CNqAAAAABJRU5ErkJggg==',
      'https://thepiratebay.org/search/{{IMDB_TITLE}}%20{{IMDB_YEAR}}/0/99/200',
      'No hits. Try adding an asterisk in you search phrase.'
    ],
    demonoid: [
      'Demonoid',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACJ0lEQVQ4y8WT60uTYRjG/Vb/QlH0sUYfjCKyliFviY03rC2Hug4QUhDFIlAsFjppqUVHtSzXac1lbVLu4HknYypt5dZpa01dX6K0/gBR8Nc7o/KlpPrUDdfDfbzgfrjurKz/aYIg8MP5jr8dlPVnnEeBHTj8IvOLC8HWkythg5zAbFfhHdHif6HlnlvFk7iO4dReQkmdhFI6hzRSXsQ1KPLQq6T+erac4HyLgC+mpftpEZWnN/F4QMPAmz30j5RIKMYfK6HJmk+TbT3OQYED+mXIdqptKMAbLaI3oiX4qpTga500qMN4YQs9z4roe66lI7SV9kA+tr61iOqVcoK6a7lzK3iju7H7tnPHmU9rp8iDXjVt3cW0OJRYu3Jo618n1fMQxCXfVsg89n4VPeFCzO0CVXUiLbcuEQwGMJlqSCbf8enjZ8w3zZQd0lJ7pZCLFgW3PSt+Ely+q6TqXAGmMzV0d/mYnPxCxlwuF2Nj40xPz+B2e3A53QwPRdmlKaC6Ybn8E22tDhLxt6Tfp4nH44yOjpJIJAiHw6RSKfx+P7FYDKezA4vFhrBts1w3mSAafcnU1IzU5CQUCjE7O0sgEJiLJyYmiERGpGErjY0Nv4oukzisV+MN3qeiohyHvYP0+Aeam82cMlTj8Xi4esOISsxbWLGZgqFuIydqV2M4q+Bk/SrJV3DcuJT9+sXs3Lfoz3KfL9myo9kcKc/h4LE1/3QrCx/Nb+wr7suzQv3uXZAAAAAASUVORK5CYII=',
      'http://www.demonoid.pw/files/?category=1&subcategory=0&language=0&quality=0&seeded=0&external=2&query={{IMDB_TITLE}}%20{{IMDB_YEAR}}&uid=0&sort=S'
    ],
    hdbits: [
      'HDBits',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEVIX25NY3NTanpacIBgd4dofo9wh5d4jp+Gkp+Al6iKnaiHnq+Qo6+OpbaVqbSWrr+dr7uosLidtMahtcGju8yxucKpvMiowNKvws6uxdfEzdXT2+Th5unq8PLu9Pb5/Pv+Czd4AAAAeUlEQVQYV2XOMQ7CQAxE0e+1BUkQDQUS978dXUAoBMVjSpTld/OqsRv7Qj1kD6IJmgjYAD8Mw1J1xocWRz4VEgJUNTOO72xKJJFCem2TQmkXsKQEZQpJd7gKBJSiRAGCAp/rBzbZKRe8FSvYKnc9nmC++wluPXT7vy9af0MJGITqXwAAAABJRU5ErkJggg==',
      'https://hdbits.org/browse2.php#film/dir=null&searchtype=film&actorfilm=film&search=tt{{IMDB_ID}}',
      'Nothing here!',
      'Recover password'
    ],
    asiandvdclub: [
      'AsianDVDClub',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADQ0lEQVQ4EQXBfWiUBRzA8e/z3O12Lzu23Xm3u23Osems9sJNLeNgUjFJYwMpSqaGOBe0YVBEkEW0oj+yAg0GKxpCNjFQxqQgUHwpS3Eb3dhcdGfumrfmvN3tvD33tue8+/X5KIDv7WoCRQMA6BlQBMwlUN5qQGltRr91B6XShJLKsTIDmCAThzNF2pVP3tgnb1bbiAydJRYHqxMexWEZEMC3A54ZfJpCLEZeS1CYz3D/ks66AkN/gZq4PI7Fm2R77A86b56k5gkLrnKoVqEcuDIFH3dNkpwSSp8/QEmVQl1XKSpgdoBhp5XB1tkQ2vBpVHsI78gXuHxu1Ft/ks2C+zFYgJGJJLvSSWz7+jCaQ8g/GpM6qJX7X8R9Yoj4A/j71L8Em45gSgfYOn0C/4CTCgt47LAX4f3vQ8iKhaKpCtnopJgFBkzI0m6jyMPTcrfHJ2Mgn4MEe+wi2qeij2yS4A7kNwsyCDJVjUh+RlY/apBjbkR1vdZAwuBmYlMvdd129owfxA+MndMYf/YrSo5eoKHXReML0OGAySUgkcawcTP5LKjTo/PknTp1x32MHbjB6q+X6Zg7RKcV5uY05l4+jLF/CZvAkx3Q5oFiJAw5B0UV6HUiNzYjPzRZRT/rk1GQ0Kt2kem3JNyMfAaSv3lGUiOHJLgNCW5BirOvy4PDVXLUiqiqDotRaDZnGH1vlle+beH2eY3UrFC+10/Pbggc/wDbc93kY5DRQHF6seUeYnOCcVWDRi8sRKBpQ4HbPy3T1V/Ptb4hulMzhBxt1G5fBI+dxxkw1QCJFPEwFNZAdVXCYhQqTFBmg3s/xyjtaKPGApnxi9i2WInNAws/oprBNfAua99dJL0M7v1Poa4mwOuBdBLCM+Bvg8CpS5i21bIyfpKyRgeKE9Z+z6Mq4OpMEzn/H553XqKQjKE6N8DaChRVcNpAy0B8IkeZLUZWL6GYXqe+v4+lby7gPuLn0fAvGL0WKvzNaNejqI56qPSAqQgpHfQ4FIDo3RyVDV6S11awtDlYX8jjOthNZHiBreeOcb/vS/QcKIDvwxYC4TtgLQd9HQo6KCao3VVNejGPwaBibW4hdfUKlp3tqNEgmXsZvo7R/j/9YmflnDmXVAAAAABJRU5ErkJggg==',
      'https://asiandvdclub.org/browse.php?search=tt{{IMDB_ID}}&descr=1',
      'Your search returned zero results',
      'Note: You need cookies enabled to log in.'
    ],
    kg: [
      'Karagarga',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACeklEQVQ4y2NgGBng69evIq0tLVMyMjLWnzl92o8kzX///GGNioo6w83N/Z+dnf2/tLT0f6BBJ8+ePRuKV+O/f/8Y3719q5mTnb1fVlb2v4SExH9GRsb/+vr6f5WVlf/b2Fj/2b1rdxayBqarV654LFu6tLamunqjn6/fM11d3f8gxfLy8v9FRUX/W1pYPv7165fo1y9fFL5//y7+88cPAbDm27dv+wQHBT1SV1f/r6au9l9JSem/goICGINsl5OX+6+hofG/q7NrLoZTt2zZUhYdHX3T0NDwv6am5n8dHR2wASCNIKysovxfVVX1P9Dwvw8fPjTBMMDT0/Ojtrb2fyMjo/++vr6va2trt9ra2PwGGWRlZfknPDz8UnVV1bobN244bFi9sh8ULk8fP/a4df26L8jbDF5eXt/9/f0fAwMkF+gnPpChe/bsqVm+bPnE5cuXzwUF5vZNGydtXr+ucfG8OZOXzJszc+HsWbNfPH+mD3bB9m3bWl++fKkCcxEwcESnTZu2ft26da0rV66cNHnixKXxEaEvp03o275u5fJ5J44eKf/29asMyGAUr/z+/ZsbGOcsIPaZM2eiqisrjwf4ev9Ijo978PLFC1OQOFCj2M3r13y2b95Ueu3KZdR0cPbUydJnTx5bHjmwP7O2vHRfkKfrr9nTpy569+6dBq50AmasXr60Iz8j9WRiZOi7/PTkO0VZ6VfmzZi2srul8RDQsPRVLS2757a27rmy/0Dnw0uXw79++KD28/t3ObgBVoZ6v3vamjcCE4cEsg0fP3xQPHPyRMn548fzpjU1Htk/b/7CpzdvhZ/buq11U3fP+cc3bnhNyMzZDwC4NFBQNIpjkQAAAABJRU5ErkJggg==',
      'https://karagarga.in/browse.php?search={{IMDB_ID}}&search_type=imdb',
      'No torrents found',
      'If you want the love, you have to'
    ],
    ptp: [
      'PassThePopCorn',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAKlBMVEUAAABmaLyRZsFmhsv/fGZmtOZn0ohm2qn/tGaN33dm7db/62bz/Wj////bpCx5AAAAIElEQVQI12NggAHeC3fBCMGAA5buA9OqWA0VKGUQYRcA/CAm7dSmUyEAAAAASUVORK5CYII=',
      'https://tls.passthepopcorn.me/torrents.php?searchstr=tt{{IMDB_ID}}',
      'Your search did not match anything',
      'id="loginform"'
    ],
    cinemageddon: [
      'Cinemageddon',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEULCgQWFREgFAAjGwouHQEkJCI7Kg4rLSpDKwBEMzI2NzRYPA5hPgBYSSt0SQBvTxeJVgJwXDisawCmbxe9dgDWhwC2klbokADKmkP4nQD+nQD8qBPms1j8sTP9vVH7xWnOdrycAAAAn0lEQVQY0y3PURKDIAwE0IUSsWgtVakGhN7/liVgPhh4w8xm8Xupp4zSa5RBruKcszA3xC4Es9/QhTD4wB1EQMC47Nwh5guYJugqoUF665DLZczip/7jMYfI5YQGGhQ914h0QpGtwEcyRiI2WOfAYV1GifAeQ10Ivr6gIMdSPsrKhSwpvW2ZU/kCZFuT8UiSX8XJEOajNUkFrTvBc4PIf5tsD6xZsZ4aAAAAAElFTkSuQmCC',
      'http://cinemageddon.net/browse.php?search=tt{{IMDB_ID}}&proj=0',
      'Nothing found!',
      'You are logged out.'
    ],
    extratorrent: [
      'ExtraTorrent.cc',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUeOk0WSms/TVY2UWU3YHhlbnJtb2xPd5B3eHVzen56gYeRk5Coqq1zt+B9wOq7vMa8vceKyfG4xcyZ0O+n0OzKy8jI3u7a3Nnf5Ofl5+Tp7Ojv7PHl8vfx8/D3+fX8/vsJ7KWaAAAAhElEQVQY013P0RKCIBCFYSIoQQLRUlwE3v8tXVhqqv9q57s4M8sm56ZPeDO3/+QqmKFnGoRdB2q4hQoA+ji0wuQIQLCu/IUBNIgRYZZSKhNiREhJPym+pUSwLHeB8fAG70XqIeSsvL/W0S3nTGCtlbW5g35QQjYoZbxQTJfS4DvH/t8/AbYRElhtvO2TAAAAAElFTkSuQmCC',
      'https://extratorrent.cc/advanced_search/?with={{IMDB_TITLE}}+{{IMDB_YEAR}}&exact=&without=&s_cat=&added=&seeds_from=&seeds_to=&leechers_from=&leechers_to=&size_from=&size_type=b&size_to=#results',
      'total <b>0</b> torrents found'
    ],
    torrentz: [
      'Torrentz',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAAzZpk5PgXHAAAAAXRSTlMAQObYZgAAACJJREFUCFtjrK9n/M8AQs12jMx7saE7jMz7GZkPMjIfBbIBQLMNGne6opUAAAAASUVORK5CYII=',
      'https://torrentz2.eu/search?f={{IMDB_TITLE}}+{{IMDB_YEAR}}',
      'did not match any documents'
    ],
    rarbg: [
      'RARBG',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABp0lEQVQ4y4WTP0jDQBTGI1KEOmcODh3M4lTEKZNL9hslYyGbcJtIcChCwC2LUxARIXOcHDLfKNziFByDgwgBEZHn9y6X2tYUD3695r2X7333Jw4RbQEPnIFLMB9gBia2dgUHP0fgkf4f7+AcjNYFTsFbpRsSUpFIVomAzDRx3o6rQYFSNTSNKgriysxDFJUR+QD7fx1AgF8OgUzREc8Md+cY59hN27mYDQqEsjJkhe7tfjdoykvhOM9Nt5KLQQHBRWsCdd2icxeP04WDaLMAipNMGftlVWM52ExZUhCVlJe6P429DQKlIYwL8kXeEXawqB3z4VNANz/MyAtSmoqMwig3/xmO81Js98mgQAF7Y18a4qQwrXjmZ3cq4SrvHTyAnQEBheKYxl5EseyK27alaZj8xq3w8jKWBCpyPEGOKyiSGRd98aVRuibXjyDQ5bK87EX4JEYLgbyAwDgwiDjlglf7gX3yS47b5Rw3xOmYDX0BJyxwDFTTtKQU30CNDTO35cna5LtPSutFXsMVxjMQji06ANfgDtyCG3Boc7v25t3bHNfkNr/9Azy0EznasaqWAAAAAElFTkSuQmCC',
      'https://rarbg.to/torrents.php?search={{IMDB_TITLE}}+{{IMDB_YEAR}}',
      function($dom) {
        return $dom.find('.lista2t tr').length > 1;
      }
    ],
    '1337x': [
      '1337x',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB20lEQVQ4y2NgGDTgSYRG8Ks0ywsv063PP0+3vvIoSqcYJvcoWs/xVaHHiVclPhdelfndeBar34JhwAN/OaUnUTqXnyeb/X+WYvH/aYLxvcehqtL3g1WYnqVYrn5d7PX/danv/1eF7n8fhqgGYHXF/QB5jxfxhj9eAA15kWr5/3GEZu6DUDW7FzlO318VeYINeJpi3vAwTJ0JqwGPAuQZn0ZoLnuWYPz/aZIpyBWPniaZXXyR6/z/VbH3/2fZjlceRmhK4g2LhwFyuk+idd8+ARryIs36//NM+/8vC9z/A13x+4G/bCJRAfowWLnjebL5/xfpNv9f5jr9B4XLAzfhIzcsmFkIar7vLcUEdMHS56CAjDX4/yRA7v9DR+7/92xYb9y0ZBElbICHqOujALmfDz1E/j9w4Pr/wJb9/yMnHrAhQH4jXs13bTnYHzpy7bxvx/7/ARDfs2M/f8+OYytIM9SAR7dt2JRxGnDHhi0IqOgvyOb79pz/b1uzxt6xZjW8Z8/55QGQ/wBoCNCAzlvWrMwYmm9aMqvcsWW/DtMMtPn6LSsWUaAGpju2HGtB4kCx/3ftOP4BDfbHavt9B67zQM0gfAXIL0B4jd0HqPkMkD4P9Mp1oKH1gycTAgCB9OyFFDyI8gAAAABJRU5ErkJggg==',
      'https://1337x.to/search/{{IMDB_TITLE}}+{{IMDB_YEAR}}/1/',
      'No results were returned.'
    ],
    yts: [
      'YTS',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUgHiEbICIeIB0dKh8bMxwaQRwWUxgTYBYRbRINdA8Chw4BmgkJpgAAtgAAvwAAygD2IFtIAAAAm0lEQVQI1wGQAG//ACAEMQIiASIiACBlIRAhABACABaAEREAIhEQADoxIqtxi6IiAHkiELy03WEBALcCEG7d2SAQANYQIi3uwgEiANYgEivuQAIQANchACr7IgACAMoiICz3ECEBAJ1AIh/UIgIDAD2wIl+yABA2ABfaEDVBACSkAAGetQEiIntgAAIX38qZrMYgACACKM7ttxASm8omLNhBbCUAAAAASUVORK5CYII=',
      'https://yts.ag/browse-movies/{{IMDB_TITLE}}/all/all/0/latest',
      '<h2> YIFY Movies Found</h2>'
    ],
    torrentdownloads: [
      'Torrent Downloads',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAMF0LNmMIP2wbSXcpU4IqXow8ZpAAf8MRhckAis4okM4lmd40l9YtoN48nNxDoeE2peRKpudMq+RaquZVsuxjsu5muO1tu/d2v+9ywPx8xvaKzPeW0vil1/+u2/2x3/88iP8IAAAAZUlEQVQY02WPOwqFAAwER8kDSxE/eP/TqWAtKLsW+pTgkmaHISTFSE6oSn0r+RhOXYGZABheo2diwLchA8YL0IFK+Z/Ws62wAKNrcCgDfQECmgdw7QDMSi1cVL906f4Ydxwc+bkTQKZNE4WywAAAAAAASUVORK5CYII=',
      'https://www.torrentdownloads.me/search/?search={{IMDB_TITLE}}+{{IMDB_YEAR}}',
      'total <span class="num">0</span> torrents found'
    ],
    cinematik: [
      'Cinematik',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABO0lEQVQ4y42TIZKDQBBFuQAKyQFQHACDxiIRHACDwyKpQm48kioOgMQiuQAn2FyCSV7vNjtAKtmp+kWm8/tNdw84znMNw2CKohDleb7/tmXHsywzbdsaR1dd1xLA9Ny+FR7L+wdI09REUfQRgCdJEqniAOj73pRl+RGAp+u6KwBqGIa70XXdtxVcWvi63WRAmOI4NuM4isnzvP/NgACJatq2TTRNk+x935eq9PQDoGkag6gAE08FqKgQCInqvQD0pDNgWRaJBUEgnqqqrgBtg0EyaRLXdRUwrRFHCvi9sZ/FUCiRIFPmiux3A5HMk5MBoAOAZOgMiRPPAgYYH1VxSzuA03k5oGICQoKKPRXR1vf9bvh2HHtRgfYF4CwgeEg+nGxXAFVbUdGvPvG8TGbxB8kqvVYVsXmeXyY/ABDjxk+V4DOKAAAAAElFTkSuQmCC',
      'https://cinematik.net/browse.php?cat=0&incldead=1&sort=1&type=asc&srchdtls=1&search=tt{{IMDB_ID}}',
      'Nothing found!',
      'Not logged in!'
    ],
    torrentsmd: [
      'Torrents.Md',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBUlEQVQ4y52ST0uUYRTFf/c+78z4b5DEKNRFQSGVOUNOIMhQtGgVLapVm1pYBhHUogjatPYDxITgN2gV1CoMopVM6srANNoYUjPpKM34PvM+t0XOLgPnbi4c7jmHcznQxiyN0l0uMA0QtSOQZHh2LMPjcoFVPSj560U6zDi1k4BA/sACx9/TIFACEGFW24kQKRkAg85oZGbkSKPe2OzN9PaRpbd8s/yZ5+j46Pjw1retzeVHy99bxLUJhisx3hKC7WGSL+VXgwtVTfRcqjelftNPi8qJdH/6mt/x2zWTGyu3y+/mzzN3OKLoDWqepbSSa8IFDRayTlwBeOtrfi3qiZ6Y2Zn4Z/xaVLLeyZ3aEGODKYrVJh+2PTNiuA4FE0yB7uDDq8V7i1cc7ql2Ki7tbi1MLVwNO+GTBhmqZhnwAZwwOVbmbiRMphTEUEUQhForp3kjTuImAI46iVny92GYYADx3m4VKSVIGiBYiJxziJMIILFERZxmjF8qEBJKCwWWm1Bs+amKbhvW2AN88GHXmUtaDl1x6HY15jcafOyPuHQoxX0HjWpMwwSLLNjZZqpZB1DRN7IrJ+NsvAGgQT3WdAPr/LZ1il8mON1ICFs9rPTVOdpV4YfsV5bcy9xlF7lZhC7xcr08VZ77Z6n2E3DqKgiDIYSmqlbaaSz5F/mHuVLuwf9u/gA7HNa+f9jlaQAAAABJRU5ErkJggg==',
      'https://torrentsmd.com/browse.php?imdb={{IMDB_ID}}'
    ],
    x264: [
      'x264',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAUX4AYpoBZqUAbrIAcsAAe80CfMYAiNkOh9EAiuMfh8YAkeITjOsAlfMAl+8blt4RnO1AmtJOm8kkpO1Ar/FOreRrr9lgvPR+ut+QzfGi2fiy2vPF5vnZ7frv9/z9//yEcxjFAAAAs0lEQVQYGQXBCW7DMAxFwfdJelGcBUF7/xM2BRKgthNLYmdkCAAyScBNt4k2NSQkpPgeAej1de3UZ6B8cK5h4xcwj+7H0tf9va0nfp+fIo82z6sk7W2/3PPhkRTbDandluPRDVtrMZmYyvGDe2DMwXBQizZkWJ4S9Sl4x4UMxoutJBDvad6w8zVffyytOdq9dF+m6kOJMFfWYahRPx46+jCQ2WWmKxgdzMNkxxZAB+j9A4J/SVNOtjDPVzgAAAAASUVORK5CYII=',
      'https://x264.me/browse.php?search={{IMDB_TITLE}}+{{IMDB_YEAR}}&incldead=1&xtype=0&stype=0',
      'Try again with a refined search string.',
      'Note: Three (3) failed login attempts will result in a temporary security lockout.'
    ],
    bitmetv: [
      'BitmeTV',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUKBAgtBgVNCANsDQeMEQ40LiukFg7DFQjXEQthPztRSkiDPjy1MiOwSkXMSkZlaW/TT0V1a2V/fn+bd3PHdnCIjZGioKPUlo2usLS5vL7OurriubXFyMnU09fl5eb29vg32NlRAAAAm0lEQVQYGQXBQWrDQBAAwe6ZWQkLQ8DEBx/y/8fl4otBKFpNqnwerE3aWOdsapJtQoU96KNmZkKGAHVWrYugAOJIvgBgwOMF/EQOYGx32E/YrO3+u/O9/L3pKSs1RWRIKINKQ4DbviNFzA6luWloUS2BkkHHYtfVCE3JYfRVdNpgoSwXPl0FkKaRHDUThD5nxP7xQbHaZzM8jsx/QZk1XcUYj70AAAAASUVORK5CYII=',
      'http://www.bitmetv.org/browse.php?search={{IMDB_TITLE}}',
      'Nothing found!',
      'Not logged in!'
    ],
    kinozal: [
      'Kinozal',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB+0lEQVQ4T2Owdm/wAeL/UOzDAARoYrjEwWIgwf8nzl/6/+HN/f9TF+767x/R8b+gdvH/Gzdv/P/49tb/q9dv/J+9dM9/r5C2/809K/9/fHEOKHcRbAjcAJDmn28v/v/9DoL/vj+Hhs////H2wv/vby78f/v23v8Pz8+hGOAzY9Hu/7+AGqdyc6BgmAF30vz+r5IV+X/IRvf/t9cX/meWL0R4AeYKkAtur5j4f4WMCFgziA3SfKMg5v98Yb7/02Uk/q/xdAAbALcd5gIH7yawM0EaYAaA2DeX9v0/YKL8/9LUBhQvxab0IVwAcs6kebvgkkskBcEG3Ih1/j+Tj/P/SgdzjDCZMGcX2Btw54NCGt2ATgaG/6fbSzA0g/Chk6iB+P/Vk8twSZgXVkgBaQnR/7frMzAMeHgXyQCQU548vAqXnAcMMJABT9rS/x91NgC75Iin2f9PNxDePHzqHIoXfKpbl2MYAGL/vLfr/0YtebAhR2O8/v95ewYsXtmyDDMaQRKvljWCDQBhEBsk9mJW1f+5AjxgQ457QAIUIxpLG5aCJbAlpF8P9/0/3Zj/f1OIB9iQc/3VqAkJHIiPMUMaH75yFS0WumbsABtSWLfkv41HI5g+AgwokBgoykAuBKkrqFn8/+q1c//XbNqPmhdAHCiGZ1uoM1Gci00tANqbcjckBbSEAAAAAElFTkSuQmCC',
      'http://kinozal.tv/browse.php?s={{IMDB_TITLE}}',
      'Нет активных раздач, приносим извинения.'
    ],
    hdspain: [
      'HDSpain',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUQEyQWHi0mKzgRQnU6P0wsTHxLTFUxWYhTXWk9Z5Fga3dRcphvd4Fhe5t/hIdwiamCi5d/lrKHmbGWnqmUpburrLGbr8ertsS2vse/x9DL09rT2+Le5Ojl5+Tr8fP4/PwJwkjrAAAArUlEQVQY012KWXLEIAxEW8Q7ZmQWDxbywP1vGTL+y+uqrlctoclZWj0fpDbUAbEWwsOkKAaXnjDx9Yo7YcNFdJUDkxBJ2TEhAsb0S4QRObCgjzFOOPpTzgZ/0/Z+d9lgFoMlYcCeAlFYiMywpYQQvPe9wle8B3Mo9b4/PRqYGc7ph90X1V6wNjdxNojzKtZarOvKpdpcJXP3FfPsHDfWND9gHK/7zrO68QE///gFOwENOGpGQOcAAAAASUVORK5CYII=',
      'https://www.hd-spain.com/browse.php?{{IMDB_TITLE}}'
    ],
    bithdtv: [
      'BitHDTV',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAM1BMVEVAAADycADyegDygyv1jAD2lgLxmjP2oQD3rQDyszT4vQHyvVr5yAb40EX71iP92gD58XfXuXcpAAAAAXRSTlMAQObYZgAAAGFJREFUGNNlT1sOwCAMUldtxUd3/9NuZrqtkS9KCFDnPtTuDCJL/d8UiKUZ4UaylhBNBudJBHqODllO4qq9q65SH0iAUqBTODwxBsG7Kz1pDehmKzjaZUy0LfPBvpeT23EBWkoCeXAFA5cAAAAASUVORK5CYII=',
      'https://www.bit-hdtv.com/torrents.php?search={{IMDB_TITLE}}',
      'No match!',
      detectRefreshRedirect
    ],
    awesomehd: [
      'Awesome-HD',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC+0lEQVQ4y3VTSUtbURh9O9G/IA6rKo41YKvdtMVaEEQF0Y1V3ChOtTgkNhqTZqhDNEb05anRiHUeSZMoaSgajaIb3YlvIVY3IroRHGJ4Ek7vvaWCghcO3OE73/nOd+/luCfj+PhYtry8LExMTIhjY2MBCjp3uVzC0dGRjHtu3N3dhS4uLg4YjUaJELC6ugqn0wmHw8Hmk5OT6OzslGZmZgb8fn/oIzLZCLNard6uri5Q8ubmJmZnZzE9Pf2Ara0tTE1Nobu7GzzPe29vb8MeEtjtdoEcBEm5WF9fx8rKCmw2G5tvb29jZGQExBY2NjYwPj4Ok8kUJAICI5+cnMja2tqkoaEhuN1upi4IAogd3N/fQ5IkZsNisbAEHo8HpFoYDAbp8PBQRtV5s9mMhYUF7OzssMDBwUFcXl7i7OwMp6enuLq6wvDwMPr7+1nM0tISent7MTc3x3OELFICbRQNon3Y39/HxcUF+vr6aLk4Pz+HKIrMP41dW1tjVZCmilxFRUWgo6ODNUqtVmN+fp7Z8Hq9bI82lRJ8Ph+zpdFo/t8IysvLA1x2dnagrKyMKdE+UOj1eqhUKmi1WoaWlhbodDqmTs97enooGVlZWQGuoKBAzM/PR21tLVFfQF1dHUpLS1FZVQXeIhDFbxiyDsM2OorpmVn8ILdQXVODnJwcEHGRUygUfFJSEs0Gt+c3iouLUVxSgoaGRvx0ulhwi6oVcrkCCkUT7A4nioo+ISYmBvX19Ty3t7eXEh0dLcXFxWHQOoLcvDx0mczotwzAahtFk7KZITU1FVRI970dHzI/Ijw8XNrd3f33tOVyOR8fHx/UGNqRmJiI2NhYvH33Hs1qLYpKSvFVpUFFdS0qP3+BRt+OtPT0ILEqPLzEm5ubkMLCwl+vXqcxMi2PJARdv0xJIYQ3D0hKTib+c73X19dhT/9DiFKpNEZFRfkjIiIQGRn5CHSPwN8ol/eSfxD67K88ODh4Qd6DLiMjw5eQkPCHIjMz09fa2qqnZ0/j/wLh8zZcSejfaQAAAABJRU5ErkJggg==',
      'https://awesome-hd.me/torrents.php?id=tt{{IMDB_ID}}',
      'Your search did not match anything',
      'Keep me logged in.'
    ],
    avistaz: [
      'AvistaZ',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACZklEQVQ4EQXBT2iWdRwA8M/v9zzv63Kka75m6qyIoWV/DMQayBoUwQ6KuEqEPNjNSweriwQZgVKXoDp48rDIRLIgOtQ6hDbIMQmhQWC0/ogVLTfm7A/v9jzPt88HAAAAAKBAGwAFQAaA6c1FCwAAsB1jOIX3MYwEGQAWqnrkz03l5MLGMpY2ljF3V9kcWJ2/xXc4i6dwBYPYDAng2vber7c89NhwNXOxauSiXUqX/4m4I2t6y1SM/dK8frnb3F6HTdiDRVwE14ZaF+p993Wrpwdi5XERu4t4494ca1sCsa4lnuvkQDcxj9ewDWX+YiQ/uWWDkWh328WOB/3aV2ju5FgnWxwoTWwr3NNJ3t6ZjG5K7eDNnJzBVVR550B6aWVtUzW9C+bmLmk6yfJ0MnsF1xmfDc8uJReEv2sRR4qbTZgFyGV/DOmPolj7n5nuksFVnPwt7KorgjOyY93sp2lOjKT6eor9AJCjX591RcqPDkuPPKOaq+wuuIWH69o8JI4vN54YklodGwAgW+P3ld46Xj03afXix453k9G6BlcjdKrK3ro2sT/7lyat8SMA5G5vfNXTSSuH9qx34PxWp6ayE3sTyPhQ4Zt2uLGBnv5o3ejx6Q/v5RaAFw+mzvInRcTEjojJ3RETYn2/yEkg3jmcQin++iDVi+dSAADkd8+an1kojuopuG2VvjGWbtEE7RYzf4Sj+zRffi+fnnL/zx+lEgAAXBoffOHmZ6uDXGEFVauw/NZhcfqVFHhgajyVAAAAYmZXCXgZn+/YaroonD846hBsvTuVAAAAAE4ekdACgOdHtQAAAOB/xuPqOv7xO8oAAAAASUVORK5CYII=',
      'https://avistaz.to/movies?search=&imdb=tt{{IMDB_ID}}',
      'No torrents found!',
      'Forgot Your Password?'
    ],
    baconbits: [
      'baconBits',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAElBMVEVjb2yAAAD/AAD/gIDAwMD/yMiKKu/5AAAAAXRSTlMAQObYZgAAAGZJREFUCFs9jdEJwCAQQ0/oAD1rBzDgAOXw34ILVLn9V2mg0nyERy5cRH4F3T+IyHSVAICeJRYf0EiYVhk+cpqZo1xyVJ/mkzBQGPLEgltlOWuED0LqN8Mk2mRTZDr/d01ruLcF1Av9ug6Qi8e/mQAAAABJRU5ErkJggg==',
      'https://baconbits.org/torrents.php?action=basic&searchstr={{IMDB_TITLE}}+{{IMDB_YEAR}}',
      'Your search was way too l33t',
      'You will be banned for 6 hours after your login attempts run out'
    ],
    bluebirdhd: [
      'BlueBird',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAACH0lEQVQoz4VSS2tTYRD9HnNfubm9murGR21MGhXtyo0UtBtFcJG9GFy4EfwrunIlggtXii5cCILioqgo6sKmVqloTNPQkJA2N2nv+/U5SSkoaJzlfGfOd86ZoQ+fPb/7tRHopkgT8u+ijIHnVo5Mwu33y9kr13maEiEIGTsiSfefPgA7immzkfg+oWPxgjBFEWkKycDaqn8ncUzpHxNJiiV2evjEKOOyzDe7EFo9Y6PjOE4Ux2T3FyGEriqGqqBMRIdRNLAdwXl2owtaEl0oFT5UF6v1mgywg0Y31yqXj+WnXT9wXK9r9Zvt9ttq1e12gAUeUBb2NnsrX0CRUStK4cD3G9nI918vLKA2RVEPHDx0bvbUy5XPEDqOAvxEsagzoqoqx/gABv3+REZbb67du3WTyMgiLpbL85fK+7JZQMI4ikonZ8/MzRl6Jqtl9pjG2uqqbdt9y0KB6FsEQaNWQ7UgIZumCcbevXm1tPhJQjJCGKOu46IS/C1XLKFp4Pz02XnP94MkAckwwji2grDlR3I6imiYJr9xtXL08NSWg7OuF4aC8m/1n70gghCUDnb0idzMcWQarWi48m2Q256/7fleEEZx0hn0ltY7cm4SIi3zceCm+oRZMH/f64t6i5IWHRVSJEmqTuVlEYNk5jLThTQI/n4Pu4c09KYoxLbQs2rkZzCp/x0fDqjuj2V659GTx1aYmHsx37Fwxlz3PHV+Ac6QFHoZo1YgAAAAAElFTkSuQmCC',
      'https://bluebird-hd.org/browse.php?search=&incldead=0&cat=0&dsearch={{IMDB_TITLE}}%&stype=or',
      'Nothing found',
      'К сожалению страница, которую вы пытаетесь посмотреть'
    ],
    broadcasthenet: [
      'BroadcasTheNet',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACw0lEQVQ4y42SX0hTURzHr3fbPef8pkG99CAhRIKlIhHVU0Qv9RS9+hSEkAslt5lO29KphTolHW62f243nRNk2rQI0iQrTA1LQ5x/VloR/XmxByEszdO5ZyqtMDrw5Rx+v8/3d3/3/I4g/GNheeE4DkRPCv+7SEdMldL5Wo39UQn7pveBPLtO5DmK/LPpKDAnJbfPqSH4RrVjAU3H21RNcPEY9rxCxDOZAZ7JDbZT5JnKVLsnJCm0dEQdXEr7y6gNRDWSHEuH9tgX6IhRJMdOkJbRTLCPULA/o7hlLAfJ80dZ7gfTsiawkL2rc1ad2H5g5oPWP/MT/DOrrP3DpHEoE2yDFGwPKW58lCN5pg+w3FfGrEEguiLUjUvbZuR6UQveKQpe1q5rwsgLVkUyoDpCFaGaviwiCEmSd/Kcwigscr/0xt25FSK0Po8xrRPH+CI3W8OIXA1mgDlEFSFzVxa29mI+Gcf4Y8ZSpndC3WMsoOv3U6H5yQrYn1Jyc7iMQ6UBhK/4DkJJ2zqU+CkqactWYjzXMKRTWOZZRfWD+4Xkiu50qH+wBrYBCjfuFfJpGLyioHOo0GVnGBU574oFXiTp3Xx8YO3N42z9ACXVfYcEXNmzmxk/M7FAxMV/oaY/ace3UnXHorBMy6g6sleIV+0ZY1ojleFvgs5Ott/FpaYkdYE9oRhj3issWMPzwqk8MT6F8uBZsHRRpg1sDvXzt2EOqUmxR0MMLo22opvPHJlDrk2OIksoL16xTOZfQCa5G0wyVcQubAIXe85goysNG26lIaPrNIuNbOWR6fYw91o6492R0oAoXPCJ2OgdgGIvZdrgu9HznWn19xgrPCoUOBGY/GLC5SSb2ngAFTmugd75EfStFAybYmeid35iE6lVmJTyP8xba4/JzVsS85sBFTozSX5DLly0nWfnLJWuScuZMl/Cpf4Cmc0+ISdaHKUAAAAASUVORK5CYII=',
      'https://broadcasthe.net/torrents.php?imdb=tt{{IMDB_ID}}',
      'Error 404',
      'Lost your password?'
    ],
    cartoonchaos: [
      'Cartoon Chaos',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADIElEQVQ4y22Rz28UZQBA38w37m63u7QW0i0tBVsKsZY2tdYbkJgGvECEKAeTnoxHTTxw0INRjEfCH2CDmpiYEEKNjSbQNvyK2BY4tJRgW+0PdwXHLTs7Mzs7s7vzzTceNB4M7w94ecnTkleuxPVLlyCXg+5uuH4dFhZiTp3SmJ2tUSh8BHwH/Ak0+B+6LBbBtqGnBzY22FkuI1xX6o8fx4O9vSmh68eBDkDjGehsb8OOHWBZvNfWxsLEBLmREUNNT2vDXV2053KHgL1A5lkCQ2gaUaVC59wc71+4wL6eHtIDAxq9vdy8e5cQdgNHgEUgAPR/i7KAbqRyORpLSzwxTY6dPMknZ8+improGx9HO3OGRKFgyMnJd5XvnyCViuJsNqt1dLSmhdCbLAut++rV2L58mcrFiwC0HTjA7nPnSLS3oykFQhApRagUDSFISEmf47BncxNrbQ0jHUU8d/o06Y4O5NYW6f37EUKgK4VSChXHNISBHtY5uL5On2mStG3MYpGVR48wkpqGoeskjx5FDQ3hTE0RdXaR6NpD6Ac4Ty1q+Tz9v66S81y2lcJyHNY3Ntja2sJICkFsGDj37+M9fMjzY2OEu3LYP/xINr/Ka5mAY70JzFbJxJ3f8asutl3Cq3j/XEjoOpGUtA4Pk3xlFOfnOUbnp3hnsJnDr79ASy6L1ixQrkOpZHL+mzwyiv/bqB2ZmYmlrmO5VYzvv+XzIXjj+ABaSxP4NQhrENUgDiD2WV4ucG3+D4rlOj89KKMdnp2Ny36dzOSXfHWijf7RPghDfLdKSkTohBAFID2IPIgboGJipZi6s40RCAN7/gafDUr6X90L0ufBcp7p22t88PYhdBGC9IlDD9+vYXsSL4iIVIxSMUZFxSizwOBoBqout+c2Of/1PUZeasPIBOC4RI0ajteg5ErcqqRak4DGrUULvSpDTFLMLeYhcDDNIl98+DIrvxWZubYCqkaxXOfJ0zqmVeevch3bk9z7xcELIgRvvflpHUFw4ybjY7sYeLGZTCrkYGeKjydW0dHY2ZKgaDcoOSGVaoRTldxasujfl+FvqCOMJcJKv+YAAAAASUVORK5CYII=',
      'http://www.cartoonchaos.org/index.php?page=torrents&search={{IMDB_TITLE}}&category=0&options=0&active=0',
      '>Av.</td>',
      'not authorized to view the Torrents'
    ],
    classix: [
      'Classix-Unlimited',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAY1BMVEVwAAA5OjhLTEpTVFJdX1xmZ2VqbGlub21zdXJ5e3h+f32Bg4CNj4yVl5SdnpuipKGoqqesrquws6+2uLW6vLnAwr/ExsPJy8fN0MzT1dLY2tfc3tvf4d7k5uPp6+j09vL+//yIRtfFAAAAAXRSTlMAQObYZgAAAJRJREFUGBkFwdFOAkEQBdHq2XZ1E8AY/v8P9c2AwMwtzykuKwAAsP3W55cAAEDd2zyqAADsvfe4lwBQr9Ad/VkFsM4f0tsKSGCAqR4zXsn3PF9Sf0Uvc6txQK1b5Y1+jh2mysy7lfFQVVA0jBeJKpjE9FQIqip2KThO83iish0lrLV1ng7LpqS2taAGYHEaMABQuP8DJBFvD9yJvdcAAAAASUVORK5CYII=',
      'http://classix-unlimited.co.uk/torrents-search.php?search={{IMDB_TITLE}}',
      'Nothing Found',
      detectRefreshRedirect
    ],
    dvdseed: [
      'Dvdseed',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAwFBMVEUICQsBEyEAEy4SFxojFwYeICQRKUw0KBQDMGImKy4QMVAYMksgMUENNl0GQHdOOBpaOQ1APj0QSYo7Q0k0R1xYSjADWKtLTk4ZVqMYW50QXa8GYa0kW5EAYroPYL1yUyFbWFaQVQSJVhZVZG8qa7IybKAzb540bqmoYwOLbSymbRbCbQa9cg9/gH+ufyi/fCFsjKeLjI7PiBzOkSqCm7B0pNCaoaeko6GatcymucXBwsDO1dzU1tPc4uvl5+T4+/ntVDcqAAAA30lEQVQYVwXBXU7CQBSA0e/eGWTaUhDRKGrUJ+KTW3D/O9AEjREJqFEBS7FlfjxH7v1zHwAiur22lpjPU5KEaKdLozZ+zbMJAPXUu+WZ/q3iwBhjnDu63dKujFdf2Ne3tTsQXWR2p65152Wm1QZ+I76rqS47cV3Zkfhp0XXYoCU6aTP/sNk1bd6zUfOYbGe9HF9C/VTI+NsrsL/jMeD6xtrjvarXD9kHjyBylYQEn6cjCC/x0PREgCCb9+onG84LPSElAnUTqqoBsaVd7IH2Jk+E2ejCqu1FYDgzwCDL/gEF+GJOs+pBYwAAAABJRU5ErkJggg==',
      'http://www.dvdseed.eu/browse2.php?search={{IMDB_ID}}&wheresearch=2&incldead=1&polish=0&nuke=0&rodzaj=0',
      'Nic tutaj nie ma!',
      'Nie zalogowany!'
    ],
    ethor: [
      'Thor\'s Land',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAEsAA4kJBmsAHW8AGpACG8MAIMEJJY0AKcMSNX4ANcMxM5MDPMQfN6gxNokAQMMAQ8ExVaJRWJc9XcNwls11l9+JncGNstS5tdPFzNKu0PPg3vPL7v/f7/b/+vj4/vzNbpFdAAAAoklEQVQY002PSXKDQBAEGwEzTWusLAm8CAH9/1/6QHi5ZmRUZBkAETgQAgNA7kPQ1H5A8f69l4tfo9tzqSoCI1SQMnPwIjD52Hy855EdpyHV+2IfebssUxFGa295fFnadmQdZeBz7tvlNeQzPWSojHHZbO2f3dXPDZXr9lgfa9dcmByY5v41zVVFGPJC1GW/FTi/SBQfP6vgL53w4B8gglPgG7AKDn2eFB1cAAAAAElFTkSuQmCC',
      'https://ethor.net/browse.php?stype=b&c23=1&c20=1&c42=1&c5=1&c19=1&c25=1&c6=1&c37=1&c43=1&c7=1&c9=1&advcat=0&incldead=0&includedesc=1&search={{IMDB_ID}}',
      'Try again with a refined search string',
      'Vous n\'êtes pas enregistré'
    ],
    hdme: [
      'HDME.eu',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEVlZmRsbmttb2x0dnN3eXZ8fnuChIGFh4SIioeMjYqXmZadn5ygop+mqKWpq6isrquusK2ztbLAwr/IysfR09DU1tPY2tbb3drf4d7m6OXq7Onu8O3y9PD09/P4+vf6/PlaMftZAAAAmElEQVQYGQXB207CQAAFwOnu0pZKQoyS6P//my88gVxKhR5nugkA0BweGd2apzqkOzY5GRz3TttH+RgUKwl8fjlHI48jIWU6RxG17yFZuyiSutsRma9v0cT6rJ78GMYo9H+/3m+vb9WdJqn3/VzFdicKarfMQ1guM0UYL628AlFk2fTL6BWbqY8GzSbienXQTRMAuHUTAOAfG8lKXWGZLRIAAAAASUVORK5CYII=',
      'https://hdme.eu/browse.php?blah=2&cat=0&incldead=1&search={{IMDB_ID}}',
      'Try again with a refined search string',
      'Note: You need cookies enabled to log in.'
    ],
    hdsky: [
      'HDSky',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACiklEQVQ4EQXBvYtdVRTG4d+71t7nnDs580HGJBMFRRKUmSBYKKiFWMTGUhsbQRDsBIO1f4VYaWEjgo1NIKUIWlipoBaKoIQoJnDz5Z177zl77+Xz6M3nzz/36vHhZ/uDTnYXWeCIGcIpdSa5E2HUVpjLzKLfiXUp3F9tf/n+r9UH+vzdZ3+1Nh1nJ8Yhy5SAmQgjopGTMc8CVbbTRN8NrDZrgsTDOf6x3cGeRgokBUElSJ6QCUkgw5IBwt2QGe5Oyl3sdHZkSGFmMgkkzAAFSGAiJafWhszAjKCRu54WVZJk5iKAlI0HU4AlULCpwekcrAss14X720oAQWO7PcVMyEWShAz2z3Rc+/R3PnzjMsfnMl/9sGS5ntnrE9d/usvukOg8eO/qERfGjoqwBiYz3I0ADseOkNhW6HJidydxpndeuDzyyTuXOLnYc/3nB6SuJyKQiSQJAWAM2fnoxk2Mxt1V4/UXDylzUAMOeufqyR4ff7MkJEICiSQJJMzF6Vx565XHePKRzI0f77HaVHoTAFODECQXKDAEZhhACExQa3A4OhfHzJiNFkaNRpD5bzPz7W8POXfQYSHchbuT5CK5UcrE2EOXnJQSi95pLobk3PrjHte++BMz4/3XHsccrIlKkISQxHoqvP3yPkd7PSXgpaf2KVHoPHPl0R1McHYUB+OC1ekWWUOIBECA5YFLF5zOnblsOTt2tCq63DHmILux3m6YS8VTIuaZkEiIMBcQ4JmGQKIBDagENUS0ICSIRoSQAYDdvLOZOjeQyGlABCYhCQQESCAAgTzRWmHoBv5drie/ffv0yhPnF88cjH3LKalG0FoBjFILIFpACyhlIqWBqVRu3Vnx5Xd/f/0/VkQNu5/steIAAAAASUVORK5CYII=',
      'https://hdsky.me/torrents.php?incldead=1&search={{IMDB_ID}}&search_area=4&search_mode=0',
      'Nothing found!',
      function($dom, resp) {
        if (resp.responseText.indexOf('You need cookies enabled to log in or switch language.') > -1 || resp.responseText.indexOf('你需要启用cookies才能登录或切换语言。') > -1 || resp.responseText.indexOf('你需要啟用cookies才能登錄或切換語言。') > -1) {
          return true;
        }
        return false;
      }
    ],
    hdtorrents: [
      'HD-Torrents',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAQADBgEICgYOEA0SFBEVFxQdHxwlJiQpKigtLywxMzA1NzQ6Ozk9Pzw/QT9BQ0FGSEVNT0xQUk9VVlRZW1hfYV5jZWJoamdzdXJ4eneKjImRk5CXmZafoZ6rraq5u7jVZFBhAAAAAXRSTlMAQObYZgAAAH5JREFUGFdtztsOgjAQBFBmKJZehaqFgsr//6XSNiYE5/Hsbnaa5hQc8x8o9rSCFeTovLNaGX8p4PKu6ACfgYoz7tNzTXDMYLgwpohF6wIO2+sdHwiDLCeOK29xxKQqGCb4MMeIvny5ogUpv2NboA97D2PsUHuAXa76a3rICT6bhgVAlZPUGwAAAABJRU5ErkJggg==',
      'http://hd-torrents.org/torrents.php?active=0&options=2&search={{IMDB_ID}}',
      'No torrents here',
      'not authorized to view this Torrents'
    ],
    torviet: [
      'TorViet',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC7ElEQVQ4EQXBO2idZRjA8f/zXr7vXHLOMbGapDUqCRYV2wguDgoiLqVbpR2Co5i16Cx26OAigpOCoLgWJy/g0MELikomA1qDWosNMWk8OffvfO/l8feTrXe/7qSy+MAW7orzxnpncU6w1jCvMwkQhaxKjMqwSsSkqjHetKnaclOxH1rnrjjvsaXFe4svDN5bmmIYTBMiQk6Z0SQxsxFIErO85FK+6bLwshPLOCRazqBWSQotbzBW6IhlHpQqG6Io3hqiZkQE8f6ci0nteke4fnGDWcioQMjK9R8PWe2WNLxwMFAmoUYkomQEwRhBVXHWwNEsc+2r27x96Tzf/XnI57+f8OrmMmsdTxbDt3dGnGm22TjVpdNwbN+4xd/3KqbjClfXicEo0SktgpKycjRWTrcbHI9m4Bs8ttTEac2DnQZvfbnLJAeWFgoKyTgUnBNSFkLM1CHTaYIxUIVISpE6KyYlqpA4CIJmR0wRzWBUM1aUHBMHw4phFRjNErt3+yy225xqGD7bOaA/jhwOZ6Sg5KhoyhhjkHNXv9CitUCv68nGEI1wX6dknsA55WQamatgMhQm0SpgXmcImXldY3ubl68FPNsvrPLeK0/xUAvevHiWFRlz6WyPvZOKrafv5/xKSQ6B9y8/QX8w5pf9CWEeMCkqTQ/f3OoDhuVeSX9cM8oFqWzxxvOPsrnc5rXn1nn24S5L3TZ3/ptDHSAnTKgT1Tzx6+0RGXh8bYm7R0MmlZIUmqVlWCV++m2f8XgKgBXDcJqYzCJuMqiZTKbsVZmfv9+jKBt8tLPPmcUmPZd5Z+eA119c43gU+fiHe6z3/uDJnuXGRGl5QboXPokpt6yxMBol6JScfmQB4xTrDAuloz8N1ElZbBiOpxnRTNsrhoAhzT8VUXJSOl3P6koTSUqJUKiiKdMrDQ80DCEq3UJoO0GyoR4Pdp0v/9mOud6IVfuZotOAoORaqWrBe1AniIAooJCSIqqa4vivPP33wv9pBJNj2ZVYuQAAAABJRU5ErkJggg==',
      'http://torviet.com/torrents.php?search={{IMDB_ID}}&search_area=4&search_mode=0',
      'Nothing found!',
      'You need cookies enabled to log in or switch language'
    ],
    iloveclassics: [
      'I Love Classics',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAwFBMVEUMANwACdQVCsoaFMM0Frc6Hao2HrNLG6FXJZNOKJ9rL4VSN5p8MHZvM4BVO5d1NnyFM2+LNmlhQIxyPn+TOGJ6P3duR4KYQF13SXquQUyjRlR7UnS0S0eiUFPURiqsT0yKWWXGUDfTUC/WVSmzYUbDYDm/YzmkalDbXyGra0vaZiW4bkKodk27dT3IczDfbiC2fD/mdB3VeCnKgDDkfRbDiTjigx7oiRLQlinslA3vnALfoB/xow7zqgTzsAz5ugAidlDAAAAAtklEQVQYGQXBsUrEUBCG0e8mE2J0BXcVtrNY8Dl8fRtLYRubrURU9BqNyWT+8ZxyDwAAANg8somJHcCz39HE8RjT00mZ+bg9PHxZv4++twPJqCuuMYEgBKe92EaTKBMysw6ZG5kiRZFIdcIuGhAwwyqS7CyCAAJAgAVrAIHKXwuYFgm5+C3TAJgTDjivVi/h3SQEaPThR9Su8dWXRdXf2p1e5o++becS33jl/Kz5rDdWbgEAAIB/EBlv2nzkGYAAAAAASUVORK5CYII=',
      'http://www.iloveclassics.com/browse.php?incldead=1&searchin=2&search={{IMDB_ID}}',
      'Try again with a refined search string',
      'Not logged in!'
    ],
    iptorrents: [
      'IPTorrents',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABTUlEQVQ4y6WTPUvDYBSF8zeKY3EqwZbYOrg0iWnSNfonimBBEJxKi6BgsikmcbO7ne1SB3VRoX5sdSzBrVTXWq7vuZBSNaCJgQP345yH902IJImnXFZXNU3fTiJkkJUsq1qqVKypaVYpiZBRVW1ZEs1e0nAkTVtzANhPC9B143gGcB2XHvp9XnTOO1xD3olHtr3xO6B91qbpZMKLKAxhBiDmr2HIvi8AwzBjAZHx5uqaXgYDhmAPSAQUX+NIkuWlhnijsSfA7H38xoFabZP33Ysu18jkcrIrZTILu9nsIvmez4ZicYXub+8oHA7pstejZrNFmqrzHPvAD6hQUAgZkT1ggBA5hw4bUOPY6FHPC/vTIJifJQM8Pz7ReDSi+lb9J8C212chGNB/B5TENeCJBaQUA3b+AWgAkBf6SBFGJs9/pCgUoZZQ8EfBqyD7CW99z7OYsUYmAAAAAElFTkSuQmCC',
      'https://www.iptorrents.com/torrents/?q=tt{{IMDB_ID}}',
      'Nothing found!',
      'Don\'t have an account?'
    ],
    mteam: [
      'M-Team',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIklEQVQ4y2Mw1RbZmBmm8YocbKghPJ+hMlnv17dT8f/JwWkh6s/BBnw9GfcPJEAqDTdgcLngy8m4/68ORIEUodgG4qOLYbjg9paQf0aawjv5uFlLEvxVH36Biu+f6/lPW1lgpYIUz+ylHQ6/cbqgMkX/qxAfGycDEHBzsgSeWOILFve0kTnEAAXKMrxzYC7BcMGkcovf4sIcWiCFIgLsFbc2h4DFg10ULgjwsrGAxPVUBdfjdMGn47H/i+N1PgKde3hNr9NfmPi1DcH/HU0lz1vqix06stD7H95YuLYh6H9yoBpGqM9vsv0/u96acCxADcCIc6gBhNPBEHSBqY7I3ookvZ9A/AtEA7PpD2Bieg3jw2g/B7lPPvayH5HEfwLVrQIAgGSE9T4ISYoAAAAASUVORK5CYII=',
      'https://tp.m-team.cc/torrents.php?incldead=0&spstate=0&inclbookmarked=0&search={{IMDB_ID}}&search_area=4&search_mode=2',
      'Nothing here!',
      function($dom, resp) {
        if (resp.responseText.indexOf('The page you tried to view can only be used when you\'re logged in.') > -1 || resp.responseText.indexOf('該頁面必須在登錄後才能訪問') > -1) {
          return true;
        }
        return false;
      }
    ],
    myspleen: [
      'MySpleen',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAQADBgIGCQUMDwsUFRMlJiQpKig8PjtWV1VvcW6Agn+LjYqanJmtr6zk5uP8/vu9nTxiAAAAhklEQVQI1wXBIQ7CMBSA4b/MkSavLyEbisyAnsEAlyAoFOkRqsFzgF2ATE3OYRBNyKYqEBykCs33oaqgqlzT2JDSkzPiFwN3DkeyUEbIZv9zAsY2u5YM2AClB+gdAlBEZt8aWL8N8wAIS6oTkJ0MxejYevJU28CFTWch8kCoIite6ePMLU1/u/4gmvtLPBsAAAAASUVORK5CYII=',
      'https://www.myspleen.org/browse.php?search={{IMDB_TITLE}}&title=1&cat=0',
      'Try again with a refined search string',
      'MySpleen :: Login'
    ],
    morethantv: [
      'morethan.tv',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA90lEQVQ4y2NgAIKFskr6QFwFxD1AXIwFFwFxJRD3AnEOEHsCMRcDVLMyEBcAcS0QFwJxOdSwSiRcBTUoCYgPAfF/IH4OxHogA7iBmI2BBABUfxRqyFQGcgBQ40KoAfPQJXaDJAbGACBnJlQQGb+DyhlD+bvxGZAGxHehEjNhrgHiUGjMgNjlRHsBqhFm2BkoW5AoA5AUvkPyziokdYtwGbAKSYMLktPBfGIMUII6eSaUDeN3EBWNZCUkIMEOxMwkGrAHasAMEEcdiHOhuQyEs3HgLCCOBuLNUM2/gdgRZAALECdAnTULZCoOPB2UeYD4ABBvA2sGAgCUmORTQ4TyTQAAAABJRU5ErkJggg==',
      'https://www.morethan.tv/torrents.php?searchstr={{IMDB_TITLE}}&filter_cat%5B1%5D=1',
      'Your search did not match anything',
      'Login :: morethan.tv'
    ],
    pixelhd: [
      'PiXELHD',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJElEQVQ4y81Su23DQAwleSdZyQwp3bgJ4CYbZItskCF0N0CWCZABXLtx5TarmP+zkPTJATRxlPx+FMBfH5Sfz/OxFXoArbLA6/NXO13feLbwbAfSX/Yf7fLdG+l9B4QzHJ7eWxUAvqxEMxBN+oBPI5xWLrDS1xrqrAJ66XsK4KhWCqBdSgAdNAkCWI4poLkPNnvAvQuL/SlmtQe7qzKASo/m3z2bAruHOpstpoCGKlfA3oSJjHFkYEwjg7piZlBGBgWZhRGju61kurOVoW4sMGs3BRMjb/3SSFx6F2aEEgoMoGgGS24iMhAFooruNiMKcKzWFaTfVKB+yb2GX2Ze7U5aI4PwyxbKD7+bNbJ8JoKqNlIBs+Z3gL/sPPxy78qshfA/zg3BTB3oJfB2bgAAAABJRU5ErkJggg==',
      'https://pixelhd.me/torrents.php?groupname=&year=&tmdbover=&tmdbunder=&tmdbid=&imdbover=&imdbunder=&imdbid={{IMDB_ID}}&order_by=time&order_way=desc&taglist=&tags_type=1&filterTorrentsButton=Filter+Torrents',
      'Your search did not match anything',
      'Login :: PiXELHD'
    ],
    revolutiontt: [
      'RevolutionTT',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUMCwgjDAs6CQdjAAAcGRa/AAEqKStMS0xlZGaDgYWdnZ2wsbLEyMng4OHw8PD9//zHkXC8AAAAkklEQVQI12P49w4M3jM8SwODPIbqMw17TnsxrGDgm3HsRUcewxOG3JXHbhbwMlxjyD1fcLuBj+EZg29WyYtyro4FDNUMW87eYTjDBpR0EHFkEOFl+GAaGgxE/AwPhIMVhUwN+Rh+LQhYtYqVaz3D/y+B//+7yv9n+P8w8P0/UTkg44HB+3/MfEDGs7T3/9Ly/gMA8vZDS4HIj1IAAAAASUVORK5CYII=',
      'https://www.revolutiontt.me/browse.php?search={{IMDB_ID}}',
      'Nothing found!',
      'Revolution :: Login'
    ],
    rutracker: [
      'Rutracker',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB/UlEQVQ4y5WSX2hSYRjGva+LZuxiENFgMGi728W6WS0GwcYSxiDHWETQKMkrLyJIJLySw6CLGaiDoWLCbgQZDSLDCy8StByiYejx+Ac2jgdt4nYgEJ9639jZztraeuDjcD6+9/c97/s9BsM5yufzkGUZhv+Voig4VDweR61WQ6vVujhIFEUcuDfwY+EljqtcLqNer58NqlQqaDabUFUVytgiZOMkL2V4jgEOhwMEP7WYyL1eD8lkEtsPX2jFtH5++Izp6Rl4PJ5/t/EoN84O6ODu4Kx2+74Q4L1YLKYHFAoFvNt9g7e1V3gtPsad1BW2Gg6HsT2+gP33Cf5X/ZuQJAnRaFQPSCT+HKDC48slPed9r3cdExO38WR5GdlslsE0Jw1QrVbR7XZxN31VKw7urHCx1WrF5b4HuDbkxfziJ1htH5HL5RAMBqGbOunZtykEdgStBbp1ZPQeLvWvou/6FxhvVLG5pSCTySAUCkEXmHa7zdYikQi+H2QYYLFY+FYqNA7KvEhmsxnp9NcjAFny+/3w+Xxwu91wOp3odDr8ZJS+gWEZN281sPR0D2sBlUNELjQAPVmpVOLB0Jec0GBdLhcfnrzfhCh1dWn86ylPiuJaLBZ56pRIk8nELdlsNtjt9vMBhyKrgiBwiwQkR5SFRqNxMQC1lUqlzs7+b/0CJa7qHxjMpcoAAAAASUVORK5CYII=',
      'http://rutracker.org/forum/search_cse.php?cx=014434608714260776013%3Aggcq1kovlga&cof=FORID%3A9&ie=utf-8&q={{IMDB_TITLE}}'
    ],
    secretcinema: [
      'Secret Cinema',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABGklEQVQ4y52TwU7CQBRF70whpunKaOKia1ExJJQQKSHQDQnTwNqFJv6HqB+HGwIL/ogeFxQDgaLlJXc397y5b+ZJxRVIqucKVLICSaEnoY3CMpBAUihj6FmLkTAlIIGk0BhDYi04xyKK0D8hm87WMKxWwDky51inKat2exulELLpLEMl9ulK4EZkzpGlKfNmcxdwAPm9tk0uiJlwv3wiyiGzRmM3wlFIXUZURwEdxsTZmG424fa7Tcvzisxb1U8CvMtWftCcBOxF6DKhtuwgP6L/AXfPsyLIkTnIUI195Mf0v2DwnpFMMx5e5ifN+xArKjdDBp9bwJrG2+pP8+GLXCcMpvD4utiNUOY3CnvVy43m3H3wzlqmUuv8AxiQrl5+mZ84AAAAAElFTkSuQmCC',
      'https://secret-cinema.pw/browse.php?search={{IMDB_TITLE}}',
      'Try again with a refined search string',
      'Lost password'
    ],
    sdbits: [
      'SDBits',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAwFBMVEU4MzI9ODdAPDo/PUFHQkFFQ0dKRURNSEdOTFBRTUtUT05WVFhZVFNaWFxdWFdaXFleXGBjX11iYGNfY2ViZGFmZGdoa2tsam10dnN4dnp8gYOAgn+DgYWHgoGHhYmHjI6Ni4+SkJSQko+PlJaUlpOWm52gop+jpqmmq66wrrKusK22s7iztbKxtri5vsDAvcK9v7y9wsTGyMXKx8zEycvL0NPSz9TP1NfY2tfY3eDg4uXi5OHl6u3r7er19/T+//wwetPpAAAAuUlEQVQYGQXBQUoDQRCG0e+vbpOZCDGKATeiF/D+Z3HrQkUIRIOM091V5Xt6KUVSghJiZB1EKUmisHCyxijhUIBGMGqQ05TL2AJjEDa83KjO7Xqe93fpXte69y8ITqs93H5g0S7l2JfGWJfTpjdzP79tnmtntP4nD+vdf1790QmPqXe3YJv+mwa2uz9bVM/D0cv74In4/iS0Mx10AQBcqa3JSEoKCEJXGBKCsFCmZAgMAAIEAqQEpYJ/PYVr7Cf70N0AAAAASUVORK5CYII=',
      'http://sdbits.org/browse.php?c6=1&c3=1&c1=1&c4=1&c5=1&c2=1&m1=1&incldead=0&from=&to=&imdbgt=0&imdblt=10&uppedby=&imdb=&search={{IMDB_ID}}',
      'Nothing found!',
      'Login :: SDBits'
    ],
    scenehd: [
      'SceneHD',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEV/qheEpTuJpUSUrFmlrJKFvzePwwmHw0OPw0WSxkiTyVKayFKbylyjy16kzmim0nG8x6Gu03Ox1n2214a+3JHB35vJ4qbQ5K/S6bnb7sbj8dDp8tnx9+b0+/D7+vH9//wlkKjwAAAAhUlEQVQYGQXBAW7CMBAAMN8lpS0Uaf9/JdNUUIOSzI6fvwmAeEbpe5msrkFvmWNXosfzYVJ2GaxLX2QBEqMcBxVItO1INrOgRDW1miNuY2t6Yp7vIdu8JyrEvBbb65tIAPGYAwksqBUSZl0RCRXm7nSLLySEfv5eCdJHcUUpLYSPqAMA5D83oy6GLHgNQAAAAABJRU5ErkJggg==',
      'https://scenehd.org/browse.php?imdb={{IMDB_ID}}',
      'No torrents found',
      'If you have forgotten your password'
    ],
    torrentday: [
      'TorrentDay',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1ElEQVQ4y2NgGBTg9buPoi/ffJAghD9/+caPofnb959cKu7ZX6Ud0v4SwnJO6b/sY2tvrth6JAVuANBkqZzmOUtA2Dmh/qq0fep/p/j6q9lNs5fLOKT9AfL/ptRMW5fbPGdpVHH/HqDYXym7lL9rdh6Pw3ANSBPIgKWbD6a/evtBEmSAumfu5z9//rLC1MxYsbMUpMY7veU0hgHOCQ1gF5y/fs/i8JlrriC2b2bbKWQ1b959lASJg7z94+cvdqSw+MGj5Jr5XcE54wcosOas3l0IUljStXA+sgGfv37nB4mDXPftx08uuMTV24+MQP61ja6+DeIXdy6YD1I4Z/WeQmQDLt64bw4SNwoqeQr0GjNcYtX2o4kgifT6GWtAfKAfz4L4R85ec0U2oHna6l6QeEH7vMUo/m+csnICSGLCoi11P3/9Ytfwyv0gbZ/y9+37T5IwNcfO3XBRdsv8DorOizcemKIYEF7YuxdkwK6jF/zvPX6hBvKONDC6QNEHwuGFPQdAGkHiExdtqUXR/OfvX2aDgOKXIMknL94objt0LgRkGBL+Cwpc95Sm8xv3norCiL6/f/8yPnjyUu3hs1dqIP7Hz98EQXw4fvpK9ePnr4IMgxIAADHZLOhr31AHAAAAAElFTkSuQmCC',
      'https://www.torrentday.com/t?q=tt{{IMDB_ID}}',
      'Nothing found',
      'Forgot Password'
    ],
    torrentleech: [
      'TorrentLeech',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAQAWGBUgIiAuMC0gOwI/QD4rUwVHSEZPUE5WWFU9bwNdX11EggRzdXJ9f3yIioeRk5BlvgSdn5ynqaZ12Qy0trOO4DrCxMHMzsul5ly164Dc39vF75rn6ebz9vL9//x/BKLsAAAAnUlEQVQY013O6w6DMAgF4KOuVqe9aFdvXeH933J0RrOMH4fkCwTAf4USQVsJZ5T5QvSOKmb7PhZkEnBMpZljn7BmcLAF4Id9GREEOiJKYa318npiTuCGKLveoLnAVLQNQF9fwHUBQ/dE2bGIrH4hgri7oSJa5axapvYEbHH2EdU0Pk7oYbSSO2MrII9R0pBqVIkowHkLzroQg/cx0QfQvhJWgfnK2QAAAABJRU5ErkJggg==',
      'https://www.torrentleech.org/torrents/browse/index/query/{{IMDB_TITLE}}/categories/1,8,9,10,11,12,13,14,15,29',
      'Please refine your search',
      'Login :: TorrentLeech.org'
    ],
    uhdbits: [
      'UHDBits',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAADoAAwLIHT8AAAAAXRSTlMAQObYZgAAAB5JREFUCNdjOFfDcK6O4VwxCjr/GYTQBP/VMfyrAQABUxWboqH36gAAAABJRU5ErkJggg==',
      'https://uhdbits.org/torrents.php?action=advanced&groupname={{IMDB_ID}}',
      'Your search did not match anything',
      'Login :: UHDBits'
    ],
    zooqle: [
      'Zooqle',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiBAUAISt1Jap4AAABXElEQVQoz42RP0sDQRDFVxMhqOAXsBCLKDFcbt/s3iXin4CClWDh1YpIIEIqBcFGEEEQi4CdQUGCCKJi5weIjRaKhQQV0lloE0XBGL2sm0tiGRxY5g3zm8eww9j/ggsxDarpgU4+ggnq/2v2BLCHIm5RpIzjk72UwzPy9IrNxvSyULTEfFiRypzhGVLGcDyAc3zxkAfgASXRp7MBFyd0jzxr1VVCKkp6ABVQigQZM8L0g1M84k61aN85ocyFmsOqZrXkSamQoH3to9flB0LJUQ8wOvgx3ukCL8hSmxWkSzzhCp8ajNbXjPvNuJy1UkN6crwrNkUpPsY3UOExrz3Z7vgYs9ZFkT7sLZGDK24Gw6ajd5AeYIei29YuKSiuSD+zmgvy0Pquf13cL9NCtzXiyh1xXQV1VaFy3aGKROflkczGHK277TVxJtNykbvCanKdCEeZ7GbnC+GtKdCIX+tLeV4Ph10JAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTA0LTA0VDIyOjMzOjQzKzAyOjAwEi9IogAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wNC0wNFQyMjozMzo0MyswMjowMGNy8B4AAAAASUVORK5CYII=',
      'https://zooqle.com/search?q=tt{{IMDB_ID}}',
      'no torrents match your query'
    ],
    yggtorrent: [
      'Yggtorrent',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAcFJREFUOI3tkTtrU2EAhp/vO5cmPamJaRIMWKu1JBTEYkHr4CV10UEHBzdRLCIOrhZRcCwVRBcdXFTQCA4OUkWkWhFEW0UUTSVDLmBoiYk5KdLmnvM5lCr9DfpM7/C+7/LAf8RqmGgrqg53aoqIAoQApVYKarUswIT0Oo0T56X4e3BNOT2pkp36dj9uhkdiNGybpUyWqm3jDgYwOy2WCwX0jg6UEPQfOez0hkLRC0KkdPV0mjFqN3+V583i7Bsa+Rz5Dx/JvHzF4Ohx7M9NEvGHbI7tYcPwTmauXCecnZM2XQ+AXZKD+0bHcfnqRmNx6OI53k5cpb5Ypi+2l/XRfrq3RQHwRbYSHBwAwJE1jiGVWqps0YWu376scme1WslneC0szcPQ2Gm8fT3M3bhHc7lC5NAIltfF/NQLADq7xM8KtTxtY5MEUFSfu70a2UdPMPwWof0DpB8/48enJJmpGTRTIxGfZP79V7afPEqrVQ5MUkgLr/X6j4VL6suthUTyjPSYtA2BoRtUvhfRXCbujQGquSJOvYmnN4zfH7w7buw4tUYjwGxJMe1P7pasOGqhkCgkEgcHEBywo++Gu9fM/nl+A1JtoWnxPuYrAAAAAElFTkSuQmCC',
      'https://yggtorrent.is/engine/search?name={{IMDB_TITLE}}&do=search',
      'Aucun résultat'
    ]
  },

  // subtitles
  {
    os: [
      'OpenSubtitles',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAKlBMVEUAAAAREREiIiIzMzNERERVVVV3d3eIiIiZmZmqqqrMzMzd3d3u7u7///9SrzZ+AAAARElEQVQI12NggAHeC3fBCMHAAjjuTmA6ewfIyGCYxuUgDWRsYpDmdgBJHWSQYbm7GSzVzs7gDWRw3p3AdfYqNmNw2wUAUH0dtNO4HWIAAAAASUVORK5CYII=',
      'http://www.opensubtitles.org/en/search/sublanguageid-eng/imdbid-{{IMDB_ID}}',
      '<b>No results</b> found'
    ],
    subscene: [
      'Subscene',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAwFBMVEUcVXQaUnAbTGgaTmobUG4bWHiHorIcXH4bW30rWnYaRl8aSmQsXntKb4QbVncZQlnD0Nfw8/UcW3wbUGzS3OIZRFylu8elt8MaR2AcWHlYeo0bTGYbS2YcVHIaRFqmvMoaSGEcWXobT2waSGIcV3gZSGMbUm8cWnsbVXXh6OwaSmMbU3IbVHMaTWkZRV0aRFstZIKWrbtpjaIcT2x4lKUcUG0cU3Lv8/a0xc8ZRl1ZfZMZSGF3laZ3l6obVnT///9+zaarAAAA2UlEQVQY0x1O2WKCMBDcHApGCSJFIw1KAIOIgd53u///Vw3u28zOBYG/cNOaZtacoScWgjAIW7PfS/l3LYjlEE7vhyO+b1eE8IpBsDHGHLHr8MPyV0+0Xt8gXov5iqeVc+DjZNPh1tsrxug9eCzhCfFuwZijegkzeYaC/E6M03pZg8d9b/kP4lrrS12ChDc72SPE6PJdCvDryOJxTuka87JUA0zpX4i7HSZKqGEAy9Nn95IgJpEQn0MGtzVa57lSYsiyGNJbe31SXj6O8QEY9fhUKiGy8RDH8T9e2htmWyQ7HAAAAABJRU5ErkJggg==',
      'http://subscene.com/subtitles/title?q={{IMDB_TITLE}}',
      function($dom) {
       return $dom.find('.search-result .exact').length > 0;
      }
    ],
    turkcealtyazi: [
      'TurkceAltyazi',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABWElEQVQ4y2N48+yBzI0ZEUvv9TvtJgXfmBqy4s2TO4oMt1bX1f2qYfj7u5Y0DNJza2lRF8PdhWnTPjaK/H02zRuMX3Yb/33ToQ7nw/CrZsW/z6d6gtnPp7j9/V7N8Pf+gqRZDCDi+WTXv////wfjlwfm/H25tQ3Oh+E7C3L/fnv/Esz+/vHd33dlTJgGvL918u/7Sva/L7AY8HJp+t8nrTp/f//8/vcb0IC3qAa4gBU9nx8D9htWA5al//0JlHt5bAWmC941iv99tav/7/tafnAA4TIAJPeqx/jv840Nf79VIYUBLFRhIYzPAGS1KAYgY0IGwPBwNAAUOG+ruP++OLYSw4Bnu6b8fV/FiWnAnYUZU2ACoHh+vHPq33f3r2LBV/4+3dCAEltgA26tbapGFvwBTONfK7Hjn9VomWllRRvDhzcvRG4tzuu7BzSNFHxrcc6Edy+fSAAA26Xexh5bDHkAAAAASUVORK5CYII=',
      'http://www.turkcealtyazi.org/find.php?cat=sub&find={{IMDB_TITLE}}',
      'Bunu mu demek istediniz'
    ],
    podnapisi: [
      'Podnapisi',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAGcAAADu7u7pQXccAAAAAXRSTlMAQObYZgAAACxJREFUCNdjEA0NYWAQXbWUgUFy1TIHECsAyFo5gUE0NBTGWrUSk4VNFigGAN4uGb2e9Kd3AAAAAElFTkSuQmCC',
      'https://www.podnapisi.net/subtitles/search/advanced?keywords={{IMDB_TITLE}}&year={{IMDB_YEAR}}&seasons=&episodes=',
      function($dom) {
        return $dom.find('table.table tr.subtitle-entry').length > 0;
      }
    ],
    yifysubtitles: [
      'YIFY Subtitles',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB00lEQVQ4y2NgoBR47vlfAcVueNSUQdUUYkhab/59zmrTz/8grJo7wwYoxIIsb7Pl9x6YvExwcQBQSBKImZDViJut+XjfdMXb/yAsaOxhAhRjBklYbfrVBxNXSGibABSqAGJldANAijX1Fzx+ozv3/n8Q5lExUrPZ+icaxlctmj8DqGYSEFsCMRs2b7IwsXMZqE+6+EWt/9x/ZKxSMHc+UH4mEDsCMQe+8GRl4RE0l2ve91uuae9/EDZZ9mohUHwuEHswsXFy227/zwTC+Axh16pbnyhWsua/WOnav0D+UqPpl3YBvfPVZtvf/0j4FxCfB1mKYYJB//EAvoy5//ky5/3lkFDqMFv94S1Q2AGIA6E4GIiDzFa//yJk6uWFYYDR0he+HLH9/znjJv4VMvPu1p1z7xNQOBFkNhArALEciGbm4AYFaBBmutj03Uql9/QO5c6jO4DcAu0Jp9cqdhz9B8T/kbFK3+kXUANRAbeSARPUtmRQyOu07oyEOjsCiMOhdKj6hHN71Bu3t+KMESDm0qhYZiuUtxQUBqpALAPE8kCsCMIytdvPKBct7CKUVZhla7buZ43s+o+OxUtWXwHKpxAygBGIZaFeCIPSMBwNxD4U52YAcE7UNoyTon8AAAAASUVORK5CYII=',
      'http://www.yifysubtitles.com/search?q={{IMDB_TITLE}}',
      'no results'
    ],
    divxsubtitles: [
      'DivX SubTitles',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAgAyIgotJhwyMzFSLgVsPABGSEVlZF+TZCu6bRZ/gH6lhWG4hEihlIKYl5L+iwClpaG7pY/Lp3z/pDf+q0W3ubbXvqL/vGvFyMT/1aPb29n/4r7q5uH+79n/9ej+//xrI2yiAAAAiElEQVQY012P2xLCIAwFj0UEay/RiqTQwv//pQhlUM9kArPJwwbxLyiPt3YNDaxzjq3AzkeWAvLqmsfpi16cOnFhIVK9pOih8MkEsMI5dZCSsoAtDbp4bFACQQO3CENXPRKbiTenh3sE0zA655gMMz1cNY12CU3dVzFb1fdn9vRfxwXv959rW94atBVysskhkwAAAABJRU5ErkJggg==',
      [
        'http://www.divxsubtitles.net/page_searchedsubtitles.php',
        {
          '_free': '{{IMDB_TITLE}}',
          '_language': '2',
          'firstSearch': 'true'
        }
      ]
    ],
    planetdp: [
      'planetdp.org',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACCklEQVQ4y52TuW8TURDG7TjG2Ht442M3XouKygVCqSIKCoSiiAqloKKMqBCFK0rEX5CaghpRIBEpIfEFPjY+Yie2YycmEakokIkogpWssffNx+4KW0IcwRQ/aY73Pr15M+MA4GTHzphx5LwzOJziLH8SHGPn2LFAH5zPBx3X/f8TMKH3bgVHUyl2ON0dHkzfnUiA2jxnNISg7XfcD03ADtyfhu1L1y4U6Nc9V6nFeWjP16QmtzI+0Pa0sO8BtTyF85on9kcBfdu7hIbgYg3+FZqXQQ3uxLTn7Zc1fHHs+YC2D8O6d0uveud+EfhW4Z5QdcbNqtIK7XKgHf4Hwr7dpR2e65e5HOo8LIwal+mX+Jt6UXDZAoOS+JJKAT8rBuNUFUAVEaj5gV2xc66Jdmu/ZIRHVDXjFjURlm1UxHu2gLElNZkWumLk5SWUJWB7hg016ZaV+5yQbuh5qWvGQGWTok2Jyv75cQlGPtijvDyHQmTR0AKro/p6qeA6SmZjTFjB5iNpgcWf/uDrRohj2TDYO3l5FDzdCD9lORnQwiArlw13WS702wFz9N7IUWRncbYpx09W5dvDtKIjp4DeKmAZhZk8/uscnL5WrlM6AiMZAWUiDJkIWMrmGUvPXrgbDn0tskBJFTYJFSyhvjAvK/+8C2dr6gMkomCb0RLbVGMTb2N/XV1GMhqf9OKI707vubLIERo7AAAAAElFTkSuQmCC',
      'https://www.planetdp.org/movie/search/?title=tt{{IMDB_ID}}',
      'Sonuç bulunamadı'
    ]
  }
];

/*******************************************************************************
 * Styles
 ******************************************************************************/

let css = '#lta_external_site_links img { margin-right: 4px; vertical-align: middle; }' +
    'img.ext_links_config { opacity: .8 }' +
    'img.ext_links_config:hover { opacity: 1.0 }' +
    '#lta_external_site_links a { white-space: pre-line; }' +
    '#lta_external_site_links h4 { margin-top: 0.5rem; }' +
    '#lta_external_site_links .links { line-height: 1.5rem; }' +
    '#lta_external_site_links .links .link-wrapper { display: inline-block; }' +
    '#lta_external_site_links .links .link-wrapper .ghost { margin: 0 0.1rem; }' +
    '#lta_external_site_links .links .link-wrapper:last-child .ghost { display: none !important; }' +
    '#lta_external_site_links .lookup-status > img { margin-right: 0; }' +
    '.cogs_wrapper { position: relative; }' +
    '#lta_configure_tooltip { color: #333; z-index: 100; font-family: Verdana, Arial, sans-serif; font-size: 11px; padding: 8px 10px; display: block; position: absolute; left: 27px; top: -2px; background-color: rgba(193,193,193,0.97); border-radius: 4px; white-space: nowrap; line-height: 1.5rem; }' +
    '#lta_configure_tooltip.hidden { display: none; }' +
    '#lta_configure_tooltip td { vertical-align: top; }' +
    '#lta_configure_tooltip h4 { margin: 0; }' +
    '#lta_configure_tooltip .controls { margin-top: 10px; }' +
    '#lta_configure_tooltip .linkemallhomepage { float: right; }' +
    '#lta_configure_tooltip img { vertical-align: text-bottom; }' +
    '#lta_configure_tooltip img.site-indicator { width: 12px; height: 12px; vertical-align: baseline; }' +
    '#lta_configure_tooltip:before { content: ""; display:block; width:0; height:0; position:absolute; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid rgba(193,193,193,0.97); left: -8px; top: 7px; }';

/*******************************************************************************
 * Functions
 ******************************************************************************/

// helper function that identifies header redirect using refresh
function detectRefreshRedirect($dom, resp) {
  if (resp.responseHeaders.indexOf('Refresh: 0; url=') > -1) {
    return true;
  }
  return false;
}

// replace imdb fields
function repl(str, encode) {
  if (typeof(encode) === 'undefined') {
    encode = true;
  }
  return str
    .replace(new RegExp('{{IMDB_TITLE}}', 'g'), encode ? encodeURIComponent(imdb_title) : imdb_title)
    .replace(new RegExp('{{IMDB_ID}}', 'g'), imdb_id)
    .replace(new RegExp('{{IMDB_YEAR}}', 'g'), imdb_year);
}

function clickCog(evt) {
  evt.preventDefault();
  if ($('#lta_configure_tooltip').hasClass('hidden')) {
    showConfigure();
  }
  else {
    cancelConfigure();
  }
}

function showConfigure() {
  // un/tick checkboxes
	let i;
  for (i = 0; i < 3; i++) {
    let s = sites[i];
    for (let key in s) {
      if (s.hasOwnProperty(key)) {
        $('#lta_configure_tooltip input[name=' + key + ']').prop('checked', $.inArray(key, config.enabled_sites) >= 0);
      }
    }
  }
  $('#lta_configure_tooltip input[name=show_category_captions]').prop('checked', config.show_category_captions);
  $('#lta_configure_tooltip input[name=open_blank]').prop('checked', config.open_blank);
  $('#lta_configure_tooltip input[name=fetch_results]').prop('checked', config.fetch_results);
  checkToggleAll();
  $('#lta_configure_tooltip').removeClass('hidden');
}

function saveConfigure() {
	let i;
  for (i = 0; i < 3; i++) {
    let s = sites[i];
    for (let key in s) {
      if (s.hasOwnProperty(key)) {
        let value = $('#lta_configure_tooltip input[name=' + key + ']').prop('checked');
        let idx = config.enabled_sites.indexOf(key);
        if (value && idx < 0) {
          config.enabled_sites.push(key);
        }
        if (!value && idx >= 0) {
          config.enabled_sites.splice(idx, 1);
        }
      }
    }
  }
  config.show_category_captions = $('#lta_configure_tooltip input[name=show_category_captions]').prop('checked');
  config.open_blank = $('#lta_configure_tooltip input[name=open_blank]').prop('checked');
  config.fetch_results = $('#lta_configure_tooltip input[name=fetch_results]').prop('checked');
  GM.setValue('config', JSON.stringify(config)).then(function() {
		updateExternalLinks();
	  $('#lta_configure_tooltip').addClass('hidden');
	});
}

function cancelConfigure() {
  $('#lta_configure_tooltip').addClass('hidden');
}

function toggleAll(cat_idx) {
  let checked = $('#lta_config_toggle_all_' + cat_idx).prop('checked');
	let i;
  for (i = 0; i < sorted_keys[cat_idx].length; i++) {
    $('#lta_config_' + sorted_keys[cat_idx][i]).prop('checked', checked);
  }
}

// monitor all category checkboxes and un/check the toggle all checkbox
function checkToggleAll() {
	let i;
  for (i = 0; i < 3; i++) {
    let all = true;
		let j;
    for (j = 0; j < sorted_keys[i].length; j++) {
      let key = sorted_keys[i][j];
      if (!$('#lta_config_' + key).prop('checked')) {
        all = false;
        break;
      }
    }
    $('#lta_config_toggle_all_' + i).prop('checked', all);
  }
}

// opens a link using POST
function postLink(e) {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === 'mouseup') {
    // get site key
    let k = $(e.currentTarget).attr('class')
    .replace('lta-outlink-post', '')
    .replace('lta-outlink', '').trim();
    let site;
	let i;
    // find key in sites
    for (i = 0; i < 3; i++) {
      let s = sites[i];
      if (typeof s[k] === 'object') {
        site = s[k];
        break;
      }
    }
    let form = document.createElement('form');
    let data = site[2][1];
    form.action = site[2][0];
    form.method = 'POST';
    form.target = config.open_blank ? '_blank' : '_self';
    for (let key in data) {
      let input = document.createElement('input');
      input.type = 'text';
      input.name = key;
      input.value = repl(data[key], false);
      form.appendChild(input);
    }
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }
}

// fetch site results
function fetchResults(key, site) {
  let $indicator = $('#lta_external_site_links .lookup-status.' + key);
  $indicator.html('<img alt="Loading…" title="Loading…" src="' + LOADING_ICON + '">');

  function noAccess() {
    $indicator.find('img')
      .attr('src', NOACCESS_ICON)
      .attr('title', 'You have to login to this site!').attr('alt', 'No access!');
  }
  function resultsFound() {
    $indicator.find('img')
      .attr('src', TICK_ICON)
      .attr('title', 'Results found!').attr('alt', 'Results found!');
  }
  function noResults() {
    $indicator.find('img')
      .attr('src', CROSS_ICON)
      .attr('title', 'No results found! :(').attr('alt', 'No results found!');
  }
  let opts = {
    timeout: 12000,
    onload: function(resp) {
      let check = site[3], logincheck = site[4];
      // check login state
      if (typeof(logincheck) === 'string') {
        if (resp.responseText.indexOf(logincheck) > -1) {
          noAccess();
          return;
        }
      }
      else if ($.isFunction(logincheck)) {
        if (logincheck($(resp.responseText), resp)) {
          noAccess();
          return;
        }
      }
      // check for results
      if (typeof(check) === 'string') {
        if (resp.responseText.indexOf(check) > -1) {
          noResults();
        }
        else {
          resultsFound();
        }
      }
      else if ($.isFunction(check)) {
        if (check($(resp.responseText), resp)) {
          resultsFound();
        }
        else {
          noResults();
        }
      }
      else {
        throw('4th array element for ' + key + ' must be either String or Function!');
      }
    },
    onerror: function(resp) {
      let status = resp.statusText;
      $indicator.find('img')
        .attr('src', ERROR_ICON)
        .attr('title', 'Error: ' + status).attr('alt', 'Error');
    },
    ontimeout: function() {
      $indicator.find('img')
        .attr('src', TIMEOUT_ICON)
        .attr('title', 'Error: Server is not responding!').attr('alt', 'Error');
    }
  };
  // POST or GET
  if(Object.prototype.toString.call(site[2]) === '[object Array]' ) {
    opts.method = 'POST';
    opts.url = site[2][0];
    opts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    let data = site[2][1];
    let data_array = [];
		let data_key;
    for (data_key in data) {
      data_array.push(data_key + '=' + encodeURIComponent(repl(data[data_key])));
    }
    opts.data = data_array.join('&');
  }
  else {
    opts.method = 'GET';
    opts.url = repl(site[2]);
  }
  GM.xmlHttpRequest(opts);
}

// add style tag
function add_style(css) {
  var h, s;
  h = document.getElementsByTagName('head')[0];
  if (!h) {
    return;
  }
  s = document.createElement('style');
  s.type = 'text/css';
  s.innerHTML = css;
  h.appendChild(s);
}

// initialize
function init() {
  // Add new link section
  let $container = $(layout === 'new' ? '.title-overview' : '.titlereference-section-overview:first > *:last');
  if ($container.length === 0) {
    console.error("IMDb: Link'em all! Failed to find container!");
    return;
  }
  add_style(css);
  // configure dialog
  let configure = '<span class="cogs_wrapper"><a href="#" title="Configure" id="lta_configure_links"><img src="' + COGS_ICON + '" alt="Configure" class="ext_links_config" width="16" height="16"></a>' +
      '<span id="lta_configure_tooltip" class="hidden"><form><table><tr>' +
      '<td><h4 title="Toggle all"><input type="checkbox" name="toggle_all_0" value="1" id="lta_config_toggle_all_0"> <label for="lta_config_toggle_all_0">' + CATEGORY_NAMES[0] + '</label></h4></td>' +
      '<td><h4 title="Toggle all"><input type="checkbox" name="toggle_all_1" value="1" id="lta_config_toggle_all_1"> <label for="lta_config_toggle_all_1">' + CATEGORY_NAMES[1] + '</label></h4></td>' +
      '<td><h4 title="Toggle all"><input type="checkbox" name="toggle_all_2" value="1" id="lta_config_toggle_all_2"> <label for="lta_config_toggle_all_2">' + CATEGORY_NAMES[2] + '</label></h4></td></tr><tr>';
  let i;
  for (i = 0; i < 3; i++) {
    configure += '<td id="lta_cat_' + i + '">';
    let s = sites[i];
    let j;
    for (j = 0; j < sorted_keys[i].length; j++) {
      let key = sorted_keys[i][j];
      let site = s[key];
      let title = site[0];
      let icon = site[1];
      let info_icons = '';
      if (site.length > 3) {
        info_icons += ' <img alt="results" title="This site shows if results are available" src="' + TICK_ICON + '" class="site-indicator">';
        if (site.length > 4) {
          info_icons += '<img alt="private" title="This site is for members only" src="' + NOACCESS_ICON + '" class="site-indicator">';
        }
      }
      configure += '<input type="checkbox" name="' + key + '" value="1" id="lta_config_' + key + '"> <label for="lta_config_' + key + '">' + (icon ? '<img src="' + icon + '" alt="' + title + '" width="16" height="16"> ' : '<span style="display: inline-block; width: 16px; height: 16px;"></span>') + title + info_icons + '</label><br>';
    }
    configure += '</td>';
  }
  configure += '</tr><tr><td colspan="3"><h4>Options</h4>' +
    '<input type="checkbox" name="show_category_captions" value="1" id="lta_config_show_category_captions"> <label for="lta_config_show_category_captions">Show category captions</label><br>' +
    '<input type="checkbox" name="open_blank" value="1" id="lta_config_open_blank"> <label for="lta_config_open_blank">Open links in new tab</label><br>' +
    '<input type="checkbox" name="fetch_results" value="1" id="lta_config_fetch_results"> <label for="lta_config_fetch_results" title="This will try to fetch results from supported sites.">Automatically fetch results</label>' +
    '<div class="controls"><span class="rightcornerlink"><a target="_blank" href="' + LTA_HOMEPAGE + '">Link \'em all! v' + GM.info.script.version + '</a></span>' +
    '<button id="lta_configure_links_done" class="btn primary small">OK</button> <button id="lta_configure_links_cancel" class="btn small">Cancel</button></div>' +
    '</td></tr></table></form></span></span>';

  let html;
  if (layout === 'new') {
    html = '<div class="article"><h2>Search ' + configure + '</h2><div id="lta_external_site_links"></div></div>';
  }
  else {
    html = '<hr><h3>Search ' + configure + '</h3><div id="lta_external_site_links"></div><hr>';
  }
  $container.after(html);

  // Setup callbacks
  $('#lta_configure_tooltip form').submit(function(evt) { evt.preventDefault(); });
  $('#lta_configure_tooltip input[name=toggle_all_0]').click(function() { toggleAll(0); });
  $('#lta_configure_tooltip input[name=toggle_all_1]').click(function() { toggleAll(1); });
  $('#lta_configure_tooltip input[name=toggle_all_2]').click(function() { toggleAll(2); });
  $('#lta_configure_tooltip input:checkbox').change(function() {
    // ignore toggle all checkbox
    let id = $(this).attr('id');
    if (id.indexOf('toggle_all') === -1) {
      checkToggleAll();
    }
  });
  $('#lta_configure_links').click(clickCog);
  $('#lta_configure_links_done').click(saveConfigure);
  $('#lta_configure_links_cancel').click(cancelConfigure);
  $('#lta_external_site_links').on('click mouseup', '.lta-outlink-post', postLink);
}

// render links
function updateExternalLinks() {
  let links = [[], [], []];
	let html = '';
	let result_fetcher = [];
	let i;
  for (i = 0; i < 3; i++) {
    let s = sites[i];
		let j;
    for (j = 0; j < sorted_keys[i].length; j++) {
      let key = sorted_keys[i][j];
      if (config.enabled_sites.indexOf(key) >= 0) {
        let site = s[key];
        let title = site[0];
        let icon = site[1];
        let cls = 'lta-outlink ' + key;
        let href;
        if(Object.prototype.toString.call(site[2]) === '[object Array]' ) {
          href = '#';
          cls += ' lta-outlink-post';
        }
        else {
          href = repl(site[2]);
        }
        let results_indicator = '';
        if (config.fetch_results && site.length > 3) {
          results_indicator = '&nbsp;<span class="' + key + ' lookup-status"></span>';
          result_fetcher.push([key, site]);
        }
        links[i].push('<span class="link-wrapper"><span class="link"><a class="' + cls + '" href="' + href + '"' + (config.open_blank ? 'target="_blank"' : '') + '>' + (icon ? '<img src="' + icon + '" alt="' + title + '" width="16" height="16">' : '') + title + '</a>' + results_indicator + '</span>&nbsp;<span class="ghost">|</span></span>');
      }
    }
    if (links[i].length > 0) {
      if (layout === 'new') {
        if (!config.show_category_captions && i > 0) {
          html += '<div style="height: 10px;"></div>';
        }
        if (config.show_category_captions) {
          html += '<h4>' + CATEGORY_NAMES[i] + '</h4>';
        }
        html += '<div class="links">' + links[i].join(' ') + '</div>';
      }
      else {
        if (config.show_category_captions) {
          html += '<div class="info"><h5>' + CATEGORY_NAMES[i] + '</h5><div class="info-content">' +
            '<div class="links">' + links[i].join('&nbsp;| ') + '</div></div></div>';
        }
        else {
          html += '<div class="info"><div class="links">' + links[i].join('&nbsp;| ') + '</div></div>';
        }
      }
    }
  }
  $('#lta_external_site_links').html(html);
  // result fetching
  for (i = 0; i < result_fetcher.length; i++) {
    fetchResults(result_fetcher[i][0], result_fetcher[i][1]);
  }
}

// parse movie info before calling init()
function parse_info() {
  // parse imdb number/layout
  let re = /^\/title\/tt([0-9]{7})\/([a-z]*)/;
  let m = re.exec(window.location.pathname);
  if (m) {
    // detect layout
    let title_selector;
    if (m[2] === 'reference' || m[2] === 'combined') {
      layout = 'legacy';
      title_selector = 'h3[itemprop=name]';
    }
    else {
      layout = 'new';
      title_selector = 'h1[itemprop=name]';
    }
    // extract movie infos
    imdb_title = $(title_selector).text().trim();
    imdb_id = m[1];
    re = /^(.+)\s+\((\d+)\)/;
    m = re.exec(imdb_title);
    if (m) {
      imdb_title = m[1].trim();
      imdb_year = m[2].trim();
    }
    else {
      imdb_year = '';
    }
    // fire!
    init();
    updateExternalLinks();
    if (first_run) {
      showConfigure();
    }
  }
}

function onLoad($) {
	let i;
  // prepare sorted_keys array
  for (i = 0; i < 3; i++) {
    sorted_keys.push(Object.keys(sites[i]).sort(function(a, b) {
			return sites[i][a][0].localeCompare(sites[i][b][0]);
		}));
  }
  // restore configuration
  GM.getValue('config').then(function(configstring) {
    if (typeof configstring !== 'undefined') {
      config = JSON.parse(configstring);
      // for scripts that were updated
      if (typeof(config.fetch_results) === 'undefined') {
        config.fetch_results = DEFAULT_CONFIG.fetch_results;
      }
      parse_info();
    }
    else {
      config = DEFAULT_CONFIG;
      first_run = true;
      GM.setValue('config', JSON.stringify(config)).then(parse_info);
    }
  });
}

$(onLoad);
