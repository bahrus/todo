# Typescript Oriented Declarative Objects (TODO's)

The term "declarative" has different meanings depending on context.

Declarative programming refers to a paradigm where all 
parameters are immutable.  But such a definition doesn't conform
to what we mean when we say "an XML or JSON configuration document, or table schema based application
is declarative".
 
In the latter case, we consider it declarative because the document (or traditional data tables) doesn't
contain implementation code.  You cannot insert breakpoints and step through the execution line by line.  

Rather, it only describes what it should do via lists of (nested) name value pairs.  A declarative program,
on the hand, can contain quite a bit of explicit instructions in how exactly
the functionality is implemented, and is certainly debuggable in the traditional sense.

Among the many benefits of JSON is that:

* A simple parser (as opposed to a complete language compiler) can be written that can 
    * Save simple objects to strings conforming to the JSON Format.   Then you can 
    * Load (or "deserialize") said JSON string back into a JavaScript object matching the original object in every observable way.  
    * But at the same time guaranteeing (barring some unforseen obscure bug in the JSON parser) no side effects
on any existing objects or functions in memory, or functionality during this loading.
The only exception being whatever side effect may be caused by the cpu and memory footprint required to create the object representation.

This lack of unexpected side effects, and the severe limitations of what is allowed in a JSON string, which can be limited even further with the help of
a JSON schema, puts such strings / files into a category of application resources that are considered much safer to modify with requiring rigorous regression testing.
GUI editors can easily be created to help with the editing of these configurations.
Indeed, it is common for applications in production to be driven by these JSON files (or strings stored in a system like MongoDB), modified on the fly via such GUI editors / managers.


But JSON syntax, in its standard compliant format, is also very limited, and those limitations prevent JSON
from being as robust a markup language as some alternatives, for configuration settings and other data messaging problems.
It can't contain comments, for starters. Such limitations are well know, and a number of proposals exist to
expand the allowed plain text syntax of JSON to include comments, and other features [TODO:  link to expressions support].
Typescript Oriented Declarative Objects do not address these limitations one way or the other.  They can work with the JSON text specification as is, 
and should be able adopt to any loosening of the restrictions which may be introduced into the JSON specification in the future, whose goal is to improve the 
"markup-ability" of JSON.

But the other major limitation of traditional JSON processing is that the set of objects for which the JSON "serialization" can be reversed,
resulting in the same exact data and behavior, is quite small.  This is because critical functionality,
such as inline or referenced functions get washed away when performing JSON.stringify(), and thus is unrecoverable when performing
JSON.parse().  In mathematical terms, the set of objects obj for which objCopy is indistinguishable from obj
in the following expression:

    objCopy = JSON.parse(JSON.stringify(obj))

is quite restrictive.  What qualifies?  Basically, objects with only fields of primitive numbers, strings, booleans, and/or, recursively, sub objects, with the same limitation.
This is the entirety of the "idempotent" universe of JavaScript objects.  Function references, or inline functions get "washed away" during the
stringify call, for example.  The purpose of TODO's


Typescript Oriented Declarative Objects are designed to expand the universe of idempotent objects that can be "stringified" or "stringalized", and focused on a different limitation of JSON.
Only the simplest of Javascript Objects can be "reverse engineered" back to an object which



We define "declarative syntax" to be a subset of a programming language, 
which satisfies the following "soft" conditions:

1)  It holds data for nested objects, including subobjects and functions
2)  The hosting language can load the nested data with certainty that doing 
so will have no effect on anything (other than the cpu cycles / memory requirements to load the data)
 -- no impact on externally defined
parameters, no webservice or database calls, no function calls, etc.  
The syntax must be completely inert, in other words.
3)  The syntax  is as minimal as possible, and is relatively easy to parse.

In the case of the programming language Typescript, we define a subset called 
"TodoScript".  

1)  Comments are allowed.  However,
	a.  For comments using this format:
		/* .. */, there can be no live code in the same line, and preceding the opening of the comment
		and no live code in the same line and following the closing of the comment.
	b.  




Browser history management

todo.Polymer.updateHash