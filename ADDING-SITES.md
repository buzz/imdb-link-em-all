## Adding new sites

A definition of new site is very easy to write.

```
google: [
  'Google',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB00lEQVQ4y42T3ysEURTH90XZ9eT/kDYRLS8oP98ohuKBIvFC8eJNIQ8U2c3GvvhtbEh+JT8SL8rvFosnKTH7o1Vrmdmd+bp3dmbtj9E69W3mds/5nHPuPVenizNJkrJEUbQSPREJih6JJgAYdX8Z2TQQJxuSGIWTJHqt4GPqIPE8AvY5eNsa4KooAFdqgrelHp9L0/KeAjmKgaiZRe4N3mYGXHGOpnw9HdGVTER6VjN7mmpkR1d5PvxTZgg3lxAc1/DbLPA0ViH08hzfkZFmt9K/4OUY3FW54ErySNCVVvNa52GhgCe6CJ3mgF83IDDbjv8aiXVSgCBXcJCG4F4KJPdWjFNRvz9BveyXCuB/AfuGMMC1mRTQPR8LeKSLj5MMePbSsXY9/GfJfSvfMmB481sF3OuUCcP53RDK2ErksTW44G4Tgp2vIkoGwxUcO0MqYJwOkZEu+JCA2u1OZC9Ww8QyGL2axtm7g8DuMOlgUTFjReGAD622ACQpDCUjkKkOknyV759uMApES8zqCN58kprdHP2A9HQ85UrImS48bKBhtwemZUaupm6nC7ZbOwLBSO+H5JMa/wr1aiVJ7t6cEBz3sIx0wuiQ0GtSdE8PLNJzlP0AcUb9Jl4kdUgAAAAASUVORK5CYII=',
  'https://www.google.com/search?q={{IMDB_TITLE}}+{{IMDB_YEAR}}'
]
```

That's all it needs!

### Adding the site

Either you edit the user script and create a [pull request](https://help.github.com/articles/about-pull-requests/) (best option) or create an issue with the code snippet.

If you don't manage to code to you can still suggest inclusion of a page in the issue.

### Code it!

In `imdb-link-em-all.user.js` you can find the definition of the available sites.

It consists of three sections. Each one category.

```javascript
const sites = [
  // general
  {
    ...,
  },

  // tracker
  {
    ...,
  },

  // subtitles
  {
    ...,
  }
]
```

To add a new site you need to append a new section to the corresponding category. It has a *key* and five different fields.

```
KEY: [
  TITLE,
  ICON_URI,
  URL,
  NO_RESULTS_MATCHER,   (optional)
  NOT_LOGGED_IN_MATCHER (optional)
]
```

Look at the source code and you'll find plenty of examples.

#### Key

The key is written lower-case, should not contain spaces or other special characters and must be **unique among all categories**. It will not appear anywhere. It's just the internal identifier for the site.

#### Fields

##### Overview

| Field                   | Description                | Type               |
| ----------------------- | -------------------------- | ------------------ |
| `TITLE`                 | The full title             | String             |
| `ICON_URI`              | Data URL for the site icon | String             |
| `URL`                   | Search URL                 | String             |
| `NO_RESULTS_MATCHER`    | blubb                      | String or Function |
| `NOT_LOGGED_IN_MATCHER` | blubb                      | String or Function |

##### `TITLE`

Just the sites title that is displayed in the user interface.

##### `ICON_URI`

A [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs). Basically the base64-encoded content of a PNG file.

1. Download the `favicon.ico` from the corresponding site. You may need to look into the HTML or try your luck with `https://newsite.com/favicon.ico` which is the standard URL many sites use.
1. Convert it to PNG using Gimp or similar.
1. Convert the file to a *data URL*:

   Once you get hold of the favicon you can use the terminal on Linux/Mac OS to get the *base64 string* or just use a [web site](https://www.base64encode.org/) that can do that for you.

   ```shell
   $ base64 -w0 < favicon.png
   ```

   Compiling the data URL is easy: `data:image/png;base64,BASE64_STRING` (Replace `BASE64_STRING` with the actual base64 string.)

**Pro tip 1:** Use GIMP to create an indexed-color version for smaller file size.

**Pro tip 2:** Use `pngcrush` to make the file even smaller.

##### `URL`

The sites search URL.

You can use variables.

| Variable         | Description                                                         | Example     |
| ---------------- | ------------------------------------------------------------------- | ----------- |
| `{{IMDB_ID}}`    | IMDb ID. Some sites need the leading `tt`. Then use `tt{{IMDB_ID}}`. | `0163978`   |
| `{{IMDB_TITLE}}` | Movie title                                                         | `The Beach` |
| `{{IMDB_YEAR}}`  | Movie year                                                          | `2000`      |

- Always prefer `{{IMDB_ID}}` **if** the site supports searching by IMDb ID.
- Please always use HTTPS if the site supports it.

###### GET request

In the easiest case you can use a string that looks something like this: `https://www.google.com/search?q={{IMDB_TITLE}}+{{IMDB_YEAR}}`.

To find this address you can use the site search and look at the address bar in your browser. If the site is using a GET request you can see your search terms somewhere in the address.

If this is not the case the site is likely using POST to carry out search requests.

###### POST request

*IMDb: Link 'em all!* does support POST requests for searching sites. Look at examples (e.g. `kereses` site).

For this to work you need to add an Array instead of a String.

```
[
  URL,
  POST data (Object), values are strings, with variables replaced
]
```

Example:

```
[
  'http://www.surrealmoviez.info/advanced_search.php',
  {
    simdb: '{{IMDB_ID}}'
  }
]
```

##### `NO_RESULTS_MATCHER`

In order to find out if there are search results the script will fetch the result page and look at it.

Leave this value out or set it to `null` to disable result fetching for the site.

###### String

Easy. Just specify the string that appears for no results:  `No results found!` or similar.

There are also cases where it is harder. Some pages don't show a phrase like this but an empty table or something else.

**Tip:** The script just looks at the raw HTML code. So sometimes you want to match something like `<h3>0 Results for` or `We found <strong>0</strong> results`. Examine at results page source code!

###### Function

For more flexibility you can specify a Function that is called on the results page: `function($dom, response)` that returns `true` which means ![Tick](http://www.famfamfam.com/lab/icons/silk/icons/tick.png) (results found) or `false` which means ![Cross](http://www.famfamfam.com/lab/icons/silk/icons/cross.png) (no results found).

```javascript
function($dom) {
  return $dom.find('table.searchResults tbody tr').length > 0;
}
```

##### `NOT_LOGGED_IN_MATCHER`

Some sites require you to login before you're allowed to search.

It works very similar to `NO_RESULTS_MATCHER`.

Again: Leave this value out to disable login detection for the site.

###### String

Example: `Not logged in!`

###### Function

`function($dom, response)` that returns `true` which means "logged in" or `false` which means ![Lock](http://www.famfamfam.com/lab/icons/silk/icons/lock.png) (not logged in).

**Pro tip:** Some pages will just redirect you to the login page. You can detect this by passing `detectRefreshRedirect`.
