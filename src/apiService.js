// import { useState } from 'react';
import axios from "axios";
const BASE_URL = 'http://localhost:8088/api';
const client = axios.create({
      baseURL: 'http://localhost:8088/api' ,
      headers: {
        'Content-Type': 'application/json',
        // You can add additional headers if needed
      },
   });

const handleResponse = async (response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return response.json();
  };

export const getGameApi = async (id) => {
  try {
  const res = await client.post('/games/'+id)
//     const response = await fetch(`${BASE_URL}/games/` + id);
//     // const data = await response.json();
    return handleResponse(res);
  } catch (error) {
    console.error('Error getGameApi:', error);
    throw error;
  }
};

  export const createGame = async(player1, player2) => {
    try {
      console.log("create game api call...")
      const names = [player1, player2]
      const res = await client.post('/games', {playerName: names})
      return res;
    }
    catch(error) {
      console.error(`Error in POST request to Game:`, error);
      throw error;
    }        
  }

export const makeMoveApi = async(id, playerId) => {
    try {
        const queryParams = new URLSearchParams({
            playerId: playerId,
          });
        const res = await client.put(`/games/pit/${id}/makemove?${queryParams}`);
        return res;
    } catch (error) {
      console.error('Error makeMoveApi:', error);
      throw error;
    }
  };

export const getPlayersForGameApi = async (id) => {
  try {
    const response = await client.get(`${BASE_URL}/players/games/${id}`);
    return response;
  } catch (error) {
    console.error('Error getPlayersForGameApi:', error);
    throw error;
  }
};