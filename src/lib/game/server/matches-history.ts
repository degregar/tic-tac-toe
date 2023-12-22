import { GameDto } from "@/lib/game/types";
import { postgresClient } from "@/lib/postgres/init-scripts/db";

export const storeGameResult = async (game: GameDto) => {
  await postgresClient.connect();

  try {
    const query = `
      INSERT INTO games (uuid, player_x_uuid, player_o_uuid, winner_uuid, turn, board, finished_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    const values = [
      game.uuid,
      game.playerXUuid,
      game.playerOUuid,
      game.winnerUuid,
      game.turn,
      JSON.stringify(game.board),
      new Date(),
    ];

    await postgresClient.query(query, values);
  } catch (error) {
    console.error("Error while storing game result", error);
  } finally {
    await postgresClient.end();
  }
};
