import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GeneratePassword';
  password: string = '';
  length: number = 12;
  copied: boolean = false;
  copyLabel: string = 'Copy';
  loading: boolean = false;

  includeLetters = true;
  includeNumbers = true;
  includeSymbols = true;

  constructor(private http: HttpClient) {}

  generatePassword() {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~';

    let chars = '';
    if (this.includeLetters) chars += letters;
    if (this.includeNumbers) chars += numbers;
    if (this.includeSymbols) chars += symbols;

    if (!chars.length) {
      this.password = 'Choice type symbols';
      return;
    }

    this.password = Array.from({ length: this.length }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  generateFromApi() {
    if (this.loading) return;

    this.loading = true;

    const upper = 'on';
    const lower = 'on';
    const numbers = this.includeNumbers ? 'on' : 'off';
    const special = this.includeSymbols ? 'on' : 'off';

    const url = `https://generate-passwords-server.onrender.com/api/password?length=${this.length}` +
      `&special=${this.includeSymbols ? 'on' : 'off'}` +
      `&numbers=${this.includeNumbers ? 'on' : 'off'}` +
      `&upper=on&lower=on`;


    this.http.get<any[]>(url).subscribe({
      next: data => {
        this.password = data[0]?.password || 'No password returned';
        this.loading = false;
      },
      error: () => {
        this.password = '';
        this.loading = false;
        alert('Failed to get password from API');
      }
    });
  }

  decreaseLength() {
    if (this.length > 4) this.length--;
  }

  increaseLength() {
    if (this.length < 50) this.length++;
  }

  copyToClipboard() {
    if (!this.password || this.password === 'Choice type symbols') return;

    navigator.clipboard.writeText(this.password).then(() => {
      this.copyLabel = 'Copied!';
      setTimeout(() => this.copyLabel = 'Copy', 2000);
    });
  }
}
