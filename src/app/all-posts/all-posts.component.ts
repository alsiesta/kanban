import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpHeaders } from '@azure/storage-blob';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss']
})
export class AllPostsComponent {
  posts: any = [];
  error = '';
  newPost = '';
  constructor (private http: HttpClient) { }

  async ngOnInit () {
    this.posts = await this.handleApiCall(this.loadPosts(), 'Fehler beim Laden');
  }

  addPost () {
    const url = environment.baseUrl + '/posts/';
    const user = localStorage.getItem('user_id');
    const body = { author: user, title: this.newPost };

    this.http.post(url, body).subscribe(
      response => {
        this.posts.push(response);
        this.newPost = '';
      },
      error => this.handleError(error)
    );
  }

  onCheckboxChange (event: any, post: any) {
    const url = environment.baseUrl + '/posts/' + post.id + '/';
    const updatedPost = { ...post, checked: event.target.checked };

    this.http.put(url, updatedPost).subscribe(
      response => {
        this.loadPosts().then(posts => {
          this.posts = posts;
        });
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  loadPosts () {
    const url = `${environment.baseUrl}/posts/`;
    return lastValueFrom(this.http.get(url)
    );
  }


  deletePost (event: Event, id: number) {
    event.preventDefault();
  const url = environment.baseUrl + '/posts/' + id;

  this.http.delete(url).subscribe(
    response => {
      this.loadPosts().then(posts => {
        this.posts = posts;
      });
    },
    error => {
      console.error('Error:', error);
    }
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
