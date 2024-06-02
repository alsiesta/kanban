import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  contents: any = [];
  error = '';
  constructor (private http: HttpClient) { }

  async ngOnInit () {
    this.contents = await this.handleApiCall(this.loadContents(), 'Fehler beim Laden');
  }


  loadContents () {
    const url = `${environment.baseUrl}/contents/`;
    return lastValueFrom(this.http.get(url)
    );
  }

  async handleApiCall (apiCall: Promise<any>, errorMessage: string) {
    try {
      return await apiCall;
    } catch (e) {
      this.error = errorMessage;
      console.error('Error:', e);
    }
  }

  handleError (error: any) {
    console.error('Error:', error);
    this.error = 'An unexpected error occurred';
  }

}
