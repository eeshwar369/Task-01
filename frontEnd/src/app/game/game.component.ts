import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  board: number[][] = [];
  gameId: string = '';
  currentPlayer: number = 1;
  username: string = '';
  socket!: Socket;
  message: string = '';
  vsBot = false;
  isGameOver = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'Player';
    const userId = Number(localStorage.getItem('userId'));
    this.gameId = this.route.snapshot.paramMap.get('id') || '';

    this.board = Array(6).fill(null).map(() => Array(7).fill(0));
    this.socket = io('http://localhost:3000');

    this.socket.emit('join_game', { username: this.username, userId });

    this.socket.on('game_start', (game: any) => {
      this.vsBot = game.vsBot || false;
      this.message = 'Game started!';
    });

    this.socket.on('update_board', (data: any) => {
      this.board = data.board;
      this.vsBot = data.vsBot;

      if (data.winner) {
        this.message = data.winner === 1
          ? 'You win!'
          : data.winner === 2
            ? 'Bot/Opponent wins!'
            : 'Draw!';
        this.isGameOver = true;
      }
    });
  }

  makeMove(col: number): void {
    if (this.isGameOver) return;

    this.socket.emit('make_move', {
      gameId: this.gameId,
      column: col
    });
  }

  getCellClass(value: number): string {
    return value === 1 ? 'player1' : value === 2 ? 'player2' : '';
  }

  reloadPage() {
    window.location.reload();
  }
}
