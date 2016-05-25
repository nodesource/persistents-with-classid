# persistents-with-classid

Iterates through all the persistent handles in the current isolate's heap that have class_ids and returns the ones matching specific class_id.

## Installation

    npm install persistents-with-classid

## Example

```js
const persistents = require('persistents-with-classid');

var iv1, iv2

function onTimeout() {
  clearInterval(iv1);
}

function Me() {}
Me.prototype.timeout = function () {
  clearInterval(iv2);
}

iv1 = setInterval(onTimeout, 20);
iv2 = setInterval(new Me().timeout, 30);

const result = persistents.collect();

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

inspect(result, 3);
```

### Output

```js
{ '17':
   [ Timer {
       '0': [Function: listOnTimeout],
       _idleNext:
        { _called: false,
          _idleTimeout: 20,
          _idlePrev: [Circular],
          _idleNext: [Circular],
          _idleStart: 130,
          _onTimeout: [Function: wrapper],
          _repeat: [Function: onTimeout] },
       _idlePrev:
        { _called: false,
          _idleTimeout: 20,
          _idlePrev: [Circular],
          _idleNext: [Circular],
          _idleStart: 130,
          _onTimeout: [Function: wrapper],
          _repeat: [Function: onTimeout] },
       msecs: 20 },
     Timer {
       '0': [Function: listOnTimeout],
       _idleNext:
        { _called: false,
          _idleTimeout: 30,
          _idlePrev: [Circular],
          _idleNext: [Circular],
          _idleStart: 130,
          _onTimeout: [Function: wrapper],
          _repeat: [Function] },
       [ ... ]
       msecs: 30 } ] }
```

## API

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="persistents_with_classid::collect"><span class="type-signature"></span>persistents_with_classid::collect<span class="signature">(<span class="optional">classIds</span>)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Visits all persistents with class id and collects them grouped by class id.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>classIds</code></td>
<td class="type">
<span class="param-type">Array</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>filter of class ids of Objects to call back with, defaults to async_wrap providers</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/nodesource/persistents-with-classid/blob/master/persistents-with-classid.js">persistents-with-classid.js</a>
<span>, </span>
<a href="https://github.com/nodesource/persistents-with-classid/blob/master/persistents-with-classid.js#L35">lineno 35</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a hash table keyed by class ids with each value being an array of objects with that class id
i.e.: <code>{ classid-x: [ object, object ] }</code></p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="persistents_with_classid::visit"><span class="type-signature"></span>persistents_with_classid::visit<span class="signature">(fn, <span class="optional">classIds</span>)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Visits all persistents with class id and calls back with the ones that
the user is interested in.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>fn</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>function called with each Object matching the class id filter
with signature: <code>callback(classid, object)</code></p></td>
</tr>
<tr>
<td class="name"><code>classIds</code></td>
<td class="type">
<span class="param-type">Array</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>filter of class ids of Objects to call back with, defaults to async_wrap providers</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/nodesource/persistents-with-classid/blob/master/persistents-with-classid.js">persistents-with-classid.js</a>
<span>, </span>
<a href="https://github.com/nodesource/persistents-with-classid/blob/master/persistents-with-classid.js#L7">lineno 7</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## Async Wrap Providers

```js
{ NONE: 0,
  CRYPTO: 1,
  FSEVENTWRAP: 2,
  FSREQWRAP: 3,
  GETADDRINFOREQWRAP: 4,
  GETNAMEINFOREQWRAP: 5,
  JSSTREAM: 6,
  PIPEWRAP: 7,
  PIPECONNECTWRAP: 8,
  PROCESSWRAP: 9,
  QUERYWRAP: 10,
  SHUTDOWNWRAP: 11,
  SIGNALWRAP: 12,
  STATWATCHER: 13,
  TCPWRAP: 14,
  TCPCONNECTWRAP: 15,
  TIMERWRAP: 16,
  TLSWRAP: 17,
  TTYWRAP: 18,
  UDPWRAP: 19,
  UDPSENDWRAP: 20,
  WRITEWRAP: 21,
  ZLIB: 22 }
```
 
## Contributing

To submit a bug report, please create an [issue at GitHub][].

If you'd like to contribute code to this project, please read the
[CONTRIBUTING.md][] document.

## Authors and Contributors

<table><tbody>
  <tr>
    <th align="left">Thorsten Lorenz</th>
    <td><a href="https://github.com/thlorenz">GitHub/thlorenz</a></td>
    <td><a href="https://twitter.com/thlorenz">Twitter/@thlorenz</a></td>
  </tr>
</tbody></table>


## License & Copyright

**persistents-with-classid** is Copyright (c) 2016 NodeSource and licensed under the
MIT license. All rights not explicitly granted in the MIT license are reserved.
See the included [LICENSE.md][] file for more details.


[issue at GitHub]: https://github.com/nodesource/persistents-with-classid/issues
[CONTRIBUTING.md]: CONTRIBUTING.md
[LICENSE.md]: LICENSE.md
