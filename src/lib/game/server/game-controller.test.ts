import {
  createGame,
  getGame,
  makeMove,
} from "@/lib/game/server/game-controller";

const playerX = {
  uuid: "1234",
};

const playerO = {
  uuid: "5678",
};

describe("Game Controller", () => {
  it("should create a game", async () => {
    // when
    const game = await createGame(playerX.uuid, playerO.uuid);

    // then
    expect(game.playerXUuid).toEqual(playerX.uuid);
    expect(game.playerOUuid).toEqual(playerO.uuid);
    expect(game.turn).toEqual("X");
  });

  it("should create and fetch a game", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    const updatedGame = await getGame(game.uuid);

    // then
    expect(updatedGame).toBeDefined();
    expect(updatedGame.uuid).toEqual(game.uuid);
    expect(updatedGame.playerXUuid).toEqual(playerX.uuid);
    expect(updatedGame.playerOUuid).toEqual(playerO.uuid);
  });

  it("should make a move", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    const updatedGame = await makeMove(game, playerX.uuid, [0, 0]);

    // then
    expect(updatedGame).toBeDefined();
    expect(updatedGame.uuid).toEqual(game.uuid);
    expect(updatedGame.playerXUuid).toEqual(playerX.uuid);
    expect(updatedGame.playerOUuid).toEqual(playerO.uuid);
    expect(updatedGame.turn).toEqual("O");
  });

  it("should throw an error when making a move out of turn", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    const makeMovePromise = makeMove(game, playerO.uuid, [0, 0]);

    // then
    await expect(makeMovePromise).rejects.toThrow("Not your turn!");
  });

  it("should save a game after making a valid move", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    const updatedGame = await makeMove(game, playerX.uuid, [0, 0]);

    // then
    const fetchedGame = await getGame(game.uuid);
    expect(fetchedGame).toEqual(updatedGame);
  });

  const invalidMoves = [
    [-1, 0],
    [0, -1],
    [3, 0],
    [0, 3],
    [3, 3],
  ];

  it.each(invalidMoves)(
    "should throw an error when trying to make a move outside of the board: [%d, %d]",
    async (col, row) => {
      // given
      const game = await createGame(playerX.uuid, playerO.uuid);

      // when
      const makeMovePromise = makeMove(game, playerX.uuid, [col, row]);

      // then
      await expect(makeMovePromise).rejects.toThrow("Invalid move!");
    },
  );

  it("should be turn of X player after O player made a move", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    const updatedGame = await makeMove(game, playerX.uuid, [0, 0]);
    const updatedGame2 = await makeMove(updatedGame, playerO.uuid, [0, 1]);

    // then
    expect(updatedGame2.turn).toEqual("X");
  });

  it("should throw an error when trying to make a move on an occupied field", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    const updatedGame = await makeMove(game, playerX.uuid, [0, 0]);
    const makeMovePromise = makeMove(updatedGame, playerO.uuid, [0, 0]);

    // then
    await expect(makeMovePromise).rejects.toThrow("Field occupied!");
  });

  it("should not change turn once tried to make a move on an occupied field", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    try {
      const updatedGame = await makeMove(game, playerX.uuid, [0, 0]);
      await makeMove(updatedGame, playerO.uuid, [0, 0]);
    } catch (e) {}

    // then
    const updatedGame = await getGame(game.uuid);
    expect(updatedGame.turn).toEqual("O");
  });

  it("should not change turn once tried to make a move outside the board", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    const updatedGame = await makeMove(game, playerX.uuid, [0, 0]);
    const makeMovePromise = makeMove(updatedGame, playerO.uuid, [3, 3]);

    // then
    await expect(makeMovePromise).rejects.toThrow("Invalid move!");
    expect(updatedGame.turn).toEqual("O");
  });

  it("should throw if user tries to make a move on not his game", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    const makeMovePromise = makeMove(game, "some-other-user", [0, 0]);

    // then
    await expect(makeMovePromise).rejects.toThrow("Not your turn!");
  });

  it("should return player X as a winner", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    const updatedGame = await makeMove(game, playerX.uuid, [0, 0]);
    const updatedGame2 = await makeMove(updatedGame, playerO.uuid, [1, 0]);
    const updatedGame3 = await makeMove(updatedGame2, playerX.uuid, [0, 1]);
    const updatedGame4 = await makeMove(updatedGame3, playerO.uuid, [1, 1]);
    const updatedGame5 = await makeMove(updatedGame4, playerX.uuid, [0, 2]);

    // then
    expect(updatedGame5.winnerUuid).toEqual(playerX.uuid);
  });

  it("should return player O as a winner", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    const updatedGame = await makeMove(game, playerX.uuid, [1, 0]);
    const updatedGame2 = await makeMove(updatedGame, playerO.uuid, [0, 0]);
    const updatedGame3 = await makeMove(updatedGame2, playerX.uuid, [1, 1]);
    const updatedGame4 = await makeMove(updatedGame3, playerO.uuid, [0, 1]);
    const updatedGame5 = await makeMove(updatedGame4, playerX.uuid, [2, 2]);
    const updatedGame6 = await makeMove(updatedGame5, playerO.uuid, [0, 2]);

    // then
    expect(updatedGame6.winnerUuid).toEqual(playerO.uuid);
  });

  it("should return null as a winner when game is not finished", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    const updatedGame = await makeMove(game, playerX.uuid, [1, 0]);
    const updatedGame2 = await makeMove(updatedGame, playerO.uuid, [0, 0]);
    const updatedGame3 = await makeMove(updatedGame2, playerX.uuid, [1, 1]);
    const updatedGame4 = await makeMove(updatedGame3, playerO.uuid, [0, 1]);

    // then
    expect(updatedGame4.winnerUuid).toEqual(null);
  });

  it("should not allow to make a move when game is finished", async () => {
    // given
    const game = await createGame(playerX.uuid, playerO.uuid);

    // when
    const updatedGame = await makeMove(game, playerX.uuid, [1, 0]);
    const updatedGame2 = await makeMove(updatedGame, playerO.uuid, [0, 0]);
    const updatedGame3 = await makeMove(updatedGame2, playerX.uuid, [1, 1]);
    const updatedGame4 = await makeMove(updatedGame3, playerO.uuid, [0, 1]);
    const updatedGame5 = await makeMove(updatedGame4, playerX.uuid, [2, 2]);
    const updatedGame6 = await makeMove(updatedGame5, playerO.uuid, [0, 2]);
    const makeMovePromise = makeMove(updatedGame6, playerX.uuid, [2, 1]);

    // then
    await expect(makeMovePromise).rejects.toThrow("Game is finished!");
  });
});
