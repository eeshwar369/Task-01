import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { Form, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: any = '';
  socket = io('http://localhost:3000'); // Update with backend URL if deployed

  constructor(private router: Router,private http : HttpClient) {}

  startGame() {
  if (this.username.trim().length < 3) {
    alert('Username must be at least 3 characters');
    return;
  }

  const userId = Math.floor(Math.random() * 1000000);
  localStorage.setItem('username', this.username);
  localStorage.setItem('userId', userId.toString());

  this.http.post('http://localhost:3000/api/auth/register', {
    username: this.username,
    userId: userId
  }).subscribe({
    next: () => {
      this.socket.emit('join_game', { username: this.username, userId });
      this.socket.on('game_start', (game: any) => {
        this.router.navigate(['/game', game.id]);
      });
    },
    error: err => {
      console.error('User registration failed:', err);
      alert('User registration failed');
    }
  });
  }
}
