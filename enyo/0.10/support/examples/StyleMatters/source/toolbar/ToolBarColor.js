/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "toolbar.ToolBarColor",
	kind: HeaderView,
	noScroller: true,
	components: [
		{flex: 1},
		{kind: "Toolbar", style: "background-color: DarkOliveGreen", components: [
			{caption: "Manzanilla"},
			{kind: "Spacer"},
			{caption: "Kalamata"},
			{kind: "Spacer"},
			{caption: "Niçoise"},
			{kind: "Spacer"},
			{caption: "Picholine"},
		]}
	]
});