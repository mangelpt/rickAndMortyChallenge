import { expect } from "@jest/globals";
import { getAllData } from "../js/main.js"

test('check if data  are not empty', async () => {
  const result = await getAllData("character");
  expect(result).not.toBe(0)
})

test('check if data are not null ', async () => {
  const result = await getAllData("character");
  expect(result).not.toBeNull()
})
