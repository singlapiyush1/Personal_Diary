import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  count:boolean;

  i:number;


  private postsSub: Subscription;
  private authStatusSub: Subscription;
  alertt:any;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {

  }
  // for(this.i=0;this.i<this.totalPosts;this.i++){
  //   if(this.posts[this.i].creator == this.userId)
  //   {
  //    this.count=true;
  //    console.log(this.count);
  //   }

  // }
  ngOnInit() {
    this.isLoading = true;
    this.alertt=false;
    this.count=false;
    this.i=0;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();

      });


    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;


        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        for (let i = 0; i < this.totalPosts; i++) {
          if(this.userId == this.posts[i].creator)
          {
            this.count=true;
            console.log(this.count);
          }

        }

      });







  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }
  alert()
  {
    this.alertt=true;
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
