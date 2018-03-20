export interface RatingStats {
  averageRating: number;
  scoresCount: [{
    score: number,
    counter: number,
  }];
  totalCount: number;
}
