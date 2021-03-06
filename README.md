# Chess Game

Exploring DOM manipulation and declarative JavaScript in the creation of a chess game. Current game is pass and play.

The codebase for this game has been used to explore cyclomatic complexity (and ESlint rules relevant to this) as a measure of code quality and complexity.

### Next Steps:

-   Promotion for a pawn when reaches all the way to back line

    -   Change the board object so it's an object with a board property that is the array of squares
    -   Plus an array of pieces taken as need to keep track of all the pieces taken during the game.
    -   movePiece would be extended to also update this second array with the piece now taken.
    -   UI for player to choose what they want to promote the pawn to

-   Know which player is which / who's turn it is

### Other Ideas:

-   Solve the immutable / mutable debate:

    1. Could only store the position that hold a piece then re-render these over the table each time something changes
    2. Have the new board as one array, old board as separate array and loop over the boards and mark the changes.
       Also need a map of all the table cells with their current corresponding position.
       The td would always remain on the screen
       Caveat - the UI would never be immutable. (E.g. react just diffs the DOM and shadow DOM)

-   Chess move notation - coordinates instead of just row / col numbers. This abstracts away the rows and cols /
-   Zero indexing this would be a-h is cols / 8-1 rows
-   Interim interactive version in pure js
-   React version for presentation and interaction

### Refactoring

-   Could be a series of rules that compose a kingValidMoves() e.g. allDiagonalMoves(Infinity) allowJumping(). You could read the instructions for what a king can and can't do in this chain of declarative functions. The finer logic would be abstracted away.

### Cyclomatic Complexity

#### Project Goals:

Understand the value of testing for 'complexity' in code. On first hearing about the mathmatical notion of [cyclmatic complextity](https://en.wikipedia.org/wiki/Cyclomatic_complexity) I immediately wondered how useful it would be - checking of linearly independent paths through a program did not feel full proof. Yes, I felt that deeply nested if/else blocks were not a good thing but could this not be avoided by modularising your code very heavily? Or subject to your coding paradigm of choice (object orientated vs functional programming). I.e. wouldn't lots of classes, using inheritance fail to trigger a high complexity score, despite a developer needing to navigate and retain lots of different chunks of logic in order to understand 'what does this code do'.

For me complexity is 'how quickly can I understand this code'? But that's qualitative...

#### Investigation:

-   Benchmark current complexity using Eslint Rules
-   Benchmark current complexity using Lizard
-   What is valuable about measuring 'complexity' AKA linearly independent paths through code.
-   Complexity analysis can be one dimensional.
-   Correlating complexity with other variables usually reveals a much more useful insight.
    -   For example, plotting cyclomatic complexity vs time will display the dynamics of the code as the engineers refactor some parts or rewrite other stuff.
    -   Mapping complexity with different modules may give some hints as to which modules still need more TLC.

First measure (19 October 2019):
![First Eslint Complexity Output](./images/Starting-Complexity.png)

Most Complected Logic:

1. `kingValidMoves` - 36 statements // 11 linearly independent paths // 7 linearly indepmendent paths
2. `queenValidMoves` - 25 statements // 7 linearly independent paths
3. `bishopValidMoves` - 19 statements // 7 linearly independent paths

Questions:

-   Is there anything wrong with this many linearly independent paths objectively a problem?
    -   In the [Eslint](https://github.com/eslint/eslint/issues/4808) discussion of this complexity rule they note that the "highest we have within ESLint code is 36, but there are only 6 above 20. Maybe 20 is a good number?"
    -   What is a sensible limit?
    -   "Regardless of the exact limit, if cyclomatic complexity exceeds 20, you should consider it alarming."
    -   20 === really badly designed code
    -   10 === upper bound of what is sensible - ["In the 2nd edition of Steve McConnell's Code Complete he recommends that a cyclomatic complexity from 0 to 5 is typically fine, but you should be aware if the complexity starts to get in the 6 to 10 range. He further explains that anything over a complexity of 10 you should strongly consider refactoring your code."](https://elijahmanor.com/control-the-complexity-of-your-javascript-functions-with-jshint/)
-   What other factors indicate that code is hard to maintain - number of params, depth, number of statements.

Refactor #1:

-   Reduce verbose repetative statements in `kingValidMoves`
-   Look for the same logic being repeated with small variation - extract this into another function.
-   Identify helper functions that could be relevant to other valid moves functions
-   What is causing so many linearly independent paths? Could this be reduced?
-   Results by commit https://github.com/CLTPayne/pairing-rowan/commit/c8957389b7b419068784449f95c143553e01d1ff:
-   Extracted quite a lot of logic to shared moveHelpers.js. This feels like it's gaming the complexity measures.
    -   `kingValidMoves` - 21 statements // 6 linearly independent paths

_Results_ - Don't feel that using the complexity out put to guide refactoring has created optimal code. It is more expressive, and it's less imperative but there is further it could go. Check out commit 565079b6991e6223b50771b46e737f92ecb41e09 to compare.

Refactor #2:

-   Focus on the highlevel logic for each function - see pseudo code file at pseudoCode.js
-   Goal of refactor is the most readable, declarative code.
-   You shouldn't need to know how to play chess in order to understand the code / rules for each piece

Second measure (2nd Nobember 2019):
![Second Eslint Complexity Output](./images/Post-Refactor-2-Complexity.png)

_Results_ - Quite a lot of complexity has been shifted to the `moveHelpers.js`. Completely removed Queen and Rook from the list of complexity issues thanks to the `getPotentialHorizontalOrVerticalMoves` abstraction however this obscures the fact that the shared `validateMoves` and `getPotentialDiagonalMoves` logic is still triggering an complexity error. As these pieces don't have additional complexity like check they are now Checkout commit 8de6b6a656325815830882d2acd4f2a93283ac4b to compare. This again highlights the issue with these complexity measures - it's shifting the complexity but not removing it altogether.

Refactor #3:

-   Idea for making the old school javascript for loops more explicit? label them? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label

Update Gameplay:
Data structure Refactor for special rules:

Move:

```{
				col: 5,
				color: "black",
				piece: {
					color: "black",
					type: "pawn",
                    hasMoved: boolean,
				},
				row: 4
			}
```

```
const game = {
     board: [], // same as existing board structure
     capturedPieces: [], // adding a copy of the object before it gets deleted from the board
     history: [{
                    startSquare: {col: 1, row: 1}
                    endSquare:  {col: 2, row: 1}
                    pieceThatMoved: {
                         color: "black",
                         type: "pawn",
                    },
                    pieceCaptured: {

                    }
               }]
     },
}
```

File === column on chessboard

Approach:

1. Update movePiece() to save the hasMoved property in board
2. Implement castling logic:

Castling:

1. Check that King hasn't moved - done
2. Check that neither of the rooks has moved
   if one of them is still in start position continue - done
3. Check that the squares between the king and any not moved rook are empty - done
4. Check the empty squares AND the king's current position are not in check - done
5. If all fine, king moves two squares towards the rook across the row - done
6. And the rook then moves into the square the king 'jumped over' - done

Integration Testing - how to get the board in position for a castle.
Render for test function? See the highlights what happens after a move?

Notes from implementation:

1. Had been incorrect in thinking a piece is not the same object reference being passed around.

```
export const movePiece = (board, startCoordinate, endCoordinate) => {
	const newBoard = cloneBoard(board);
	const startPosition = getPosition(
		newBoard,
		startCoordinate[0],
		startCoordinate[1]
	);
	const endPosition = getPosition(
		newBoard,
		endCoordinate[0],
		endCoordinate[1]
	);
	console.log({ startPosition: startPosition.piece });
	endPosition.piece = startPosition.piece;
	endPosition.piece.hasMoved = true;
	startPosition.piece = null;
	console.log({ endPosition: endPosition.piece });
	return newBoard;
};
```

With the above two `console.log`s the output was alwasy that `startPosition.piece.hasMoved` was set to `true` because the `endPosition.piece` is assigned as a reference to the same piece object. Therefore updating `endPosition.piece` updates the object that both `startPosition` and `endPosition` refer to.

En Passant:

1. Create Game object - done in minimal form
2. movePiece is responsible calling what ever function - not used movePiece
3. Can tell if an en passant is a valid move by seeing if:
    - last move piece === pawn
    - last move from row === +/- 2 last move to row
    - that pawn is +/- 1 col from current pawn
4. Calculated as part of the pawn move validation steps - done

Potential Game Oject

```
const game = {
    history: [] // array of all boards rendered (after pieces moved)
    whitePiecesTaken: [] // array of all white pieces removed by other player move
    blackPiecesTaken: [] // array of all black pieces removed by other player move
    currentPlayer: null // set to white or black? Is it useful and does it need to be in the game object?
    lastMove: {
        from: {
            row: 1,
            col: 0,
            piece: { color: "black", hasMoved: false, type: "pawn" },
            color: "black"
        },
        to: {
            row: 1,
            col: 0,
            piece: { color: "black", hasMoved: true, type: "pawn" },
            color: "black"
        }
    } // object with reference to playerColor, typeOfPieceMoved, numberOfSquaresMoved
}
```

TODO:

    -   unit test for en passant valid moves
    -   refactor en passant valid move logic in pawn module
    -   refactor `index.html` implementation of castle and en passant moves - have an execute move set of functions that can be called like the move validation functions
    -   refactor / extend game object

Promotion:

-   The choice of new piece is not limited to pieces previously captured, thus promotion can result in a player owning, for example, two or more queens despite starting the game with one.
-   Add check to the pawn that sees if the move to is in the other player's first rank, if yes, before the other player makes a move, you can choose any piece to promote the pawn to. - If pawn is in opposite first rank, display block on the select input - Done
-   https://en.wikipedia.org/wiki/Promotion_(chess)
-   Select element with a list of the pieces - this is display none by default. - Done
-   Hook up the onclick logic for a) when the pawn hits the opposite end b) onchange event (a click event will open the menu by mouse or tab) - Done
-   Extension would be to update to a modal - button for each piece image and an overlay behind to obscure users from clicking on the board.

UI:

-   Render the black and white pieces captured by checking the game object

### GitHub Pages

-   GitHub pages use https://jekyllrb.com/ under the hoood.
-   GitHub pages looks for your index.html by default. (So change chessboard.html to index.html)
-   Can point the DNS to a personal domain
-   If not using a personal domain the repo name is part of the URL (So remame the repo to chess game.)

### Debugging

Some unit tests for the move / validation logic require a full board to be setup this can make it hard to know if there is an error in the test board being passed in that could be giving the a false positive or negative.
Quick way to double check the board for the test set up, copy and paste the board into `index.html` and `renderToHtml`.
Once appended to the DOM you will have a quick visual reference to make sure your set up is correct

```
    const boardToRender = [
        // Array of the 49 squares for the board goes here
    ]
    const test = renderToHtml(boardToRender);
    wrapper.appendChild(test);
```

Another option would be to add a `render()` that can work with a 'sparce' board. I.e. rather than needed to setup a 49 square board / data structure have a structure that only represents the populated squares and a render function that can 'fill in the gaps'.

### Questions

### Querying the DOM:

-   Generally avoid selecting elements by getElementsByClassName
-   Can use `js-example` - signifier to the developer that this className is just javascript and not use them for styling

-   getElementById - id is unique so you're essentially limiting the css
-   id used for anchors in the page
-   used linking labels with the elements they are labelling

-   querySelector - can get classes, ids, any valid CSS selector string
-   returns a single HTML element

-   querySelectorAll - returns a node list which is not actually an array, so you can't array methods
-   The node list is array like so you can turn it into an array (spread) and then call array methods on the new array

There is nothing that you can do in getByClassName that you can't do

### Frontend Q & A

When to use anchor tag vs button - when to use each

-   Use the button should be preferable to aria-role=button
-   Link will still be clickable if the javascript hasn’t loaded so it won’t perform the action the user thinks they are requesting. \* Links / anchor tags that are for tabs can have a #to-another-part of the page

When to use h1, h2, vs using lots of p tags

-   In theory the document outline SHOULD permit you have an h1 etc per every section element on the page. However these are not implemented per browser or assisted tech is not consistent so you can’t rely on it
-   Your home page could have the site name as an h1 and then on other pages you could have it as a anchor tag
-   Better to have incorrectly nested headings than it is to just have
-   Use assisted tech to read out the page
-   https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts
-   View the document outline as understand an example of the document outline - headings map
-   Potentially you want a heading for each core section / chunk that you might read through
-   P tags will read like straight prose - then add in the headings

When to use rem, em, px

-   Em - used less these days since the bringing in of rems - use case could be subtext or super text that you want to pin to the element that it’s subbing / supering over.
-   Rem will scale when you increment the browser font size.
-   Generally the ft uses pixels
-   Default zooming behaviour of all major browser is to zoom the whole ui not the font. You have to manually set the zoom to do text only. \* Focus on consistency.

How to order css properties in your style sheets

-   1 / layout - margin padding display position etc
-   2 / font - color, size weight, line height
-   3 / background & borders

Bem - is it bad to use 2 out of the three in a selector? e.g. highlight--small / highlight--large

-   Map bem ‘block’ the component
-   O-stepped-progress - look at the source origami code — one block and one element and one modifier but also fine to have 2 of these. If you have two modifiers then you can have a two classnames - o-banner—small o-banner—long.

### UI Strategy:

1. Page Layout:

-   Larger board
-   More obvious focus on the board - div with max-width so responsive
-   Closeable message - “play with friend on the same screen, taking it in turns to play a move”
-   Linking to rules of chess - in the header / nav bar
-   Footer with link to the repo, copyright, info about the process of building the game.
