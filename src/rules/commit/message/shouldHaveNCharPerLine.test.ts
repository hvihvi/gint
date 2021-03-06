import { hasMoreThanNCharPerLine } from "./shouldHaveNCharPerLine";

it("Should have less than 72char per lines", () => {
  // given
  const msg = `Add somethingssssssssssssssssazezeadsqsdazdsqdszasdadadadadadadadadadadadadaadadadadadadadadaezeazeazeazeazeazeazeazeaeazeazeaad`;
  // when
  const result = hasMoreThanNCharPerLine(msg, 72);
  // then
  expect(result).toBeTruthy();
});

it("Should have less than 72char per lines", () => {
  // given
  const msg = `Add something`;
  // when
  const result = hasMoreThanNCharPerLine(msg, 72);
  // then
  expect(result).toBeFalsy();
});
