
//@description A text with some entities @text The text @entities Entities contained in the text. Entities can be nested, but must not mutually intersect with each other.
//-Pre, Code and PreCode entities can't contain other entities. BlockQuote entities can't contain other BlockQuote entities. Bold, Italic, Underline, Strikethrough, and Spoiler entities can contain and can be part of any other entities. All other entities can't contain each other
formattedText text:string entities:vector<textEntity> = FormattedText;
