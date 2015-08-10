# todo
Typescript Oriented Declarative Objects

The term "declarative" has different meanings depending on context.  
Declarative programming refers to a paradigm where all 
parameters are immutable.  But such a definition doesn't conform
to what we mean when we say "an XML or JSON configuration document 
is declarative".
 
In the latter case, we consider it declarative because the document doesn't 
implement anything, it only describes what it should do.  A declarative program,
on the hand, can contain quite a bit of explicit instructions in how exactly
the functionality is implemented.

But JSON is a very limited way of defining configuration settings.  
It can't contain comments, for example,

We define "declarative syntax" to be a subset of a programming language, 
which satisfies the following "soft" conditions:

1)  It holds data for nested objects, including subobjects and functions
2)  The hosting language can load the nested data with certainty that doing 
so will have no effect on anything -- no impact on externally defined 
parameters, no webservice or database calls, no function calls, etc.  
The syntax must be completely innert, in other words.
3)  The syntax  is as minimal as possible, and is relatively easy to parse.

In the case of the programming language Typescript, we define a subset called 
"TodoScript".  

1)  Comments are allowed.  However,
	a.  For comments using this format:
		/* .. */, there can be no live code in the same line, and preceding the opening of the comment
		and no live code in the same line and following the closing of the comment.
	b.  



