# TSON

The term ["declarative"](https://en.wikipedia.org/wiki/Declarative_programming) has different meanings depending on context.

Declarative, functional programming refers to a paradigm where all parameters are immutable.  But such a definition doesn't conform
to what we mean when we say "an XML or JSON configuration document, or table schema based application
is declarative".

For starters, typically, you cannot insert breakpoints in a JSON or XML document and step through the execution line by line.
(XSLT is an exception to the rule).

A declarative program, on the other hand, can contain quite a bit of explicit instructions in how exactly
the functionality is implemented, and is certainly debuggable in the traditional sense.
 
We consider rules embodied in XML / JSON, or sql table based rules, to be declarative because the document (or traditional data tables) 
doesn't contain implementation code.  Rather, it only describes what a consuming program should do via lists of (nested) 
name value pairs.  The term DSL may be used, but that's a general term that doesn't capture the essense of the purpose of 
JSON or XML. Really a better term for this declarative paradigm might be "schema based structures".  We instead prefer the shorthand 
"declarative syntax" as opposed to "declarative programming."


JSON is useful for being able to describe simple JavaScript objects, declaratively, and in plain text format.  Like XML, 
it can be safely parsed without any side effects on existing code.  This safety feature contributes to the popularity of the format.
Another advantage of loading declarative syntax separately as JSON, vs embedded inside a JavaScript file, is that it is [typically
faster to load] (https://jsperf.com/json-parse-vs-eval).  

But JSON syntax, in its standard compliant format, is also very limited, and those limitations prevent JSON
from being as robust a markup language as some alternatives, for configuration settings and other data messaging problems.
It can't contain comments, for starters. Such limitations are well known, and a number of proposals exist to
expand the allowed plain text syntax of JSON to [include comments, self references] (https://github.com/serkanyersen/jsonplus), 
and  [other features] (https://google.github.io/jsonnet/doc/).  These enhancements are designed to work with language agnostic parsers.

TSON does not address these limitations one way or the other.  It works with the JSON text specification as is, 
and should be able to adapt to any loosening of the restrictions which may be introduced into the JSON specification in the future.

But in the realm of JavaScript in particular, the other major limitation of traditional JSON processing, that TSON does address, 
is that the set of objects for which the JSON "serialization" can be easily reversed using the standard JSON.parse function - 
resulting in the same exact data and behavior --  is quite small.  This is because critical JavaScript elements, such as inline or 
referenced functions, get washed away when performing JSON.stringify(), and thus is unrecoverable when performing
JSON.parse().  In mathematical terms, the set of objects obj for which objCopy is indistinguishable from obj
in the following expression:

    objCopy = JSON.parse(JSON.stringify(obj))

is quite restrictive.  What qualifies?  Basically, objects with only fields of primitive numbers, strings, booleans, and/or, recursively, sub objects, with the same limitation.
This is the entirety of the "idempotent" universe of JavaScript objects, from the point of view of T => JSON.parse(JSON.stringify(T)). 

There is a clear need for declarative syntax that supports objects with much more flexibility than this.  A quick look at a number of 
commonly used JavaScript control libraries reveals that the configuration for these components relies on functions, and other expressions -- 
formatters, validators, etc.

TSON is a library with two public functions -- Stringify, and Objectify, which significantly enlarges, over standard JSON, 
the universe of JavaScript (or Typescript) objects that can be serialized and then deserialized back to the same object as the original, 
with no loss of functionality.  The universe of objects for which TSON.Stringify and TSON.Objectify is idempotent is much broader, 
and a subset of such objects with simple rules to follow, called "Typescript Oriented Declarative Objects," or "TODO's." are guaranteed to
meet the idempotent criteria.  You
can work with plain old JavaScript objects as well, but the focus is on leveraging the "Typescript Way" to find the best fit for what
constitutes declarative syntax.

TSON preserves the concept of side-effect-free loading that traditional JSON adheres to, and limits the domain of allowed TODO's enough to 
not incur significantly more processing overhead from standard JSON.  The restrictions of what is allowed in a TODO is also driven
by easy to remember rules, that align with our intuitive sense of what declarative syntax should look like.

Those rules are:

1.  No parentheis (outside of string literals or comments).  This greatly reduces the chances of side effects from the deserialization process.
2.  The only keywords allowed (outside of string literals or comments) are
    * module -- only one at top level
    * type
    * extends
    * return
    * export followed by const
    * const preceded by export
    * interface
3.  Some operators are forbidden, as they cause side effects
    * ++
    * --
    * **
    * +=
    * -=
    * *=

