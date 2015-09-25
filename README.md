# persistents-with-classid

Iterates through all the persistent handles in the current isolate's heap that have class_ids and returns the ones matching specific class_id.

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
<a href="https://github.com/nodesource/persistents-with-classid/blob/master/persistents-with-classid.js#L27">lineno 27</a>
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
<a href="https://github.com/nodesource/persistents-with-classid/blob/master/persistents-with-classid.js#L12">lineno 12</a>
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

## LICENSE

MIT
