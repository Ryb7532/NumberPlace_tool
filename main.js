const size = 15;
const border_width = 4;
let board = [];
let inputs = [];
let memomode = false;
let focus = null;

const highlight = () => {
  clear_color();
  const [gx, gy] = focus;
  for (let y = 0; y < 9; y++) {
    board[y][gx].div.style.backgroundColor = "#e0ffff";
  }
  for (let x = 0; x < 9; x++) {
    board[gy][x].div.style.backgroundColor = "#e0ffff";
  }
  const bleft = Math.floor(gx / 3) * 3;
  const btop = Math.floor(gy / 3) * 3;
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      board[btop + y][bleft + x].div.style.backgroundColor = "#e0ffff";
    }
  }
  if (board[gy][gx].number !== 0) {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (board[y][x].number === board[gy][gx].number)
          board[y][x].div.style.backgroundColor = "#7fffd4";
      }
    }
  }
  board[gy][gx].div.style.backgroundColor = "#87cefa";
};

const clear_color = () => {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      board[y][x].div.style.backgroundColor = "";
    }
  }
};

const write_memo = (gx, gy, n) => {
  if (board[gy][gx].number === 0) {
    let flag = !board[gy][gx].memos[n - 1].flag;
    board[gy][gx].memos[n - 1].div.textContent = flag ? n : "";
    board[gy][gx].memos[n - 1].flag = flag;
  }
};

const clear_memo = (gx, gy) => {
  for (let i = 0; i < 9; i++) {
    board[gy][gx].memos[i].div.textContent = "";
    board[gy][gx].memos[i].flag = false;
  }
};

const write = (gx, gy, n) => {
  clear_memo(gx, gy);
  board[gy][gx].text.textContent = n === 0 ? "" : n;
  board[gy][gx].number = n;
};

const checker = () => {
  clear_color();
  let exist = Array(10);
  let flag = true;
  for (let b = 0; b < 9; b++) {
    const bx = (b % 3) * 3;
    const by = Math.floor(b / 3) * 3;
    exist.fill(0);
    for (let i = 0; i < 9; i++) {
      exist[board[by + Math.floor(i / 3)][bx + (i % 3)].number]++;
    }
    exist[0] = 0;
    for (let i = 0; i < 9; i++) {
      if (exist[board[by + Math.floor(i / 3)][bx + (i % 3)].number] > 1) {
        board[by + Math.floor(i / 3)][bx + (i % 3)].div.style.backgroundColor =
          "#ff0000";
        flag = false;
      }
    }
  }
  for (let y = 0; y < 9; y++) {
    exist.fill(0);
    for (let x = 0; x < 9; x++) {
      exist[board[y][x].number]++;
    }
    exist[0] = 0;
    for (let x = 0; x < 9; x++) {
      if (exist[board[y][x].number] > 1) {
        board[y][x].div.style.backgroundColor = "#ff0000";
        flag = false;
      }
    }
  }
  for (let x = 0; x < 9; x++) {
    exist.fill(0);
    for (let y = 0; y < 9; y++) {
      exist[board[y][x].number]++;
    }
    exist[0] = 0;
    for (let y = 0; y < 9; y++) {
      if (exist[board[y][x].number] > 1) {
        board[y][x].div.style.backgroundColor = "#ff0000";
        flag = false;
      }
    }
  }
  return flag;
};

const number_reset = () => {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (board[y][x].text.textContent === "") {
        board[y][x].number = 0;
      }
    }
  }
}

const solver = () => {
  const update = (gx, gy, num, possible) => {
    let new_p = [];
    for (let y = 0; y < 9; y++) {
      new_p[y] = [];
      for (let x = 0; x < 9; x++) {
        new_p[y][x] = [];
        for (let n = 0; n < 9; n++) {
          new_p[y][x][n] = possible[y][x][n];
        }
      }
    }
    for (let y = 0; y < 9; y++) {
      new_p[y][gx][num] = false;
    }
    for (let x = 0; x < 9; x++) {
      new_p[gy][x][num] = false;
    }
    const bleft = Math.floor(gx / 3) * 3;
    const btop = Math.floor(gy / 3) * 3;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        new_p[btop + y][bleft + x][num] = false;
      }
    }
    new_p[gy][gx][num] = true;
    return new_p;
  };

  const check = (possible) => {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        let flag = false;
        for (let n = 0; n < 9; n++) {
          if (possible[y][x][n]) flag = true;
        }
        if (!flag) return false;
      }
    }
    return true;
  };

  let possible = [];
  let stack = [];
  for (let y = 0; y < 9; y++) {
    possible[y] = [];
    for (let x = 0; x < 9; x++) {
      possible[y][x] = [];
      for (let n = 0; n < 9; n++) {
        possible[y][x][n] = true;
      }
    }
  }
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      let num = board[y][x].number;
      if (num > 0) {
        possible = update(x, y, num - 1, possible);
        if (!check(possible)) return false;
      }
    }
  }
  stack.push([possible, 0]);
  while (stack.length > 0) {
    let [top, index] = stack.pop();
    if (index === 81) break;
    const y = Math.floor(index / 9);
    const x = index % 9;
    board[y][x].number = 0;
    let num = 0;
    for (num = 0; num < 9; num++) {
      if (top[y][x][num]) {
        top[y][x][num] = false;
        break;
      }
    }
    if (num === 9) continue;
    stack.push([top, index]);
    let new_p = update(x, y, num, top);
    board[y][x].number = num + 1;
    if (check(new_p)) {
      stack.push([new_p, index + 1]);
    }
  }
  return stack.length > 0;
  // const traverse = (index) => {
  //   if (index === 81) {
  //     return true;
  //   }
  //   const x = index % 9;
  //   const y = Math.floor(index / 9);
  //   const cell = board[y][x];
  //   if (cell.number === 0) {
  //     for (let n = 1; n <= 9; n++) {
  //       cell.number = n;
  //       if (checker()) {
  //         if (traverse(index + 1)) {
  //           return true;
  //         }
  //       }
  //       cell.number = 0;
  //     }
  //   } else {
  //     if (checker()) {
  //       if (traverse(index + 1)) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // };
  // return traverse(0);
};

const init = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  container.style.position = "relative";
  container.style.width = `${size * 3 * 9}px`;
  container.style.height = `${size * 3 * 11}px`;

  for (let y = 0; y < 9; y++) {
    board[y] = [];
    for (let x = 0; x < 9; x++) {
      const grid = document.createElement("div");
      container.appendChild(grid);
      grid.style.position = "absolute";
      grid.style.width = `${size * 3 - border_width}px`;
      grid.style.height = `${size * 3 - border_width}px`;
      grid.style.left = `${size * 3 * x}px`;
      grid.style.top = `${size * 3 * y}px`;
      grid.style.borderBottom =
        y % 3 === 2 ? `4px solid #000` : `4px solid #808080`;
      grid.style.borderTop =
        y % 3 === 0 ? `4px solid #000` : `4px solid #808080`;
      grid.style.borderLeft =
        x % 3 === 0 ? `4px solid #000` : `4px solid #808080`;
      grid.style.borderRight =
        x % 3 === 2 ? `4px solid #000` : `4px solid #808080`;

      let text = document.createElement("div");
      text.style.fontSize = `${size * 3 * 0.8}px`;
      text.style.fontFamily = "Arial";
      text.style.display = "flex";
      text.style.alignItems = "center";
      text.style.justifyContent = "center";
      text.textContent = "";
      grid.appendChild(text);

      let memos = [];
      for (let z = 0; z < 9; z++) {
        const memo = document.createElement("div");
        grid.appendChild(memo);
        memo.style.position = "absolute";
        memo.style.width = `${size}px`;
        memo.style.height = `${size}px`;
        memo.style.left = `${size * (z % 3)}px`;
        memo.style.top = `${size * Math.floor(z / 3)}px`;
        memo.style.fontSize = `${size * 0.8}px`;
        memo.style.fontFamily = "Arial";
        memo.style.color = "#808080";
        memo.style.display = "flex";
        memo.style.alignItems = "center";
        memo.style.justifyContent = "center";
        memo.textContent = "";
        memos[z] = { div: memo, flag: false };
      }
      board[y][x] = { div: grid, number: 0, text: text, memos: memos };

      grid.onpointerdown = (e) => {
        e.preventDefault();
        focus = [x, y];
        highlight();
      };
    }
  }

  for (let i = 0; i < 9; i++) {
    const div = document.createElement("div");
    container.appendChild(div);
    div.style.position = "absolute";
    div.style.width = `${size * 3}px`;
    div.style.height = `${size * 3}px`;
    div.style.left = `${size * 3 * i}px`;
    div.style.top = `${size * 3 * 9.5}px`;
    div.style.fontSize = `${size * 3 * 0.8}px`;
    div.style.fontFamily = "Arial";
    div.style.color = `#000`;
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.textContent = i + 1;
    inputs[i] = div;

    div.onpointerdown = (e) => {
      e.preventDefault();
      if (focus) {
        const [x, y] = focus;
        if (memomode) {
          write_memo(x, y, i + 1);
          highlight();
        } else {
          write(x, y, i + 1);
          highlight();
        }
      }
    };
  }

  const modechange = document.createElement("input");
  modechange.type = "button";
  modechange.value = "memo";
  modechange.style.fontSize = `${size}px`;
  modechange.style.fontWeight = "bold";
  modechange.style.position = "absolute";
  modechange.style.width = `${size * 3 * 1.4}px`
  modechange.style.height = `${size * 2}px`
  modechange.style.top = `${size * 3 * 11}px`;
  modechange.style.left = `${size * 3 * 0.8}px`;
  modechange.onclick = () => {
    memomode = !memomode;
    for (let i = 0; i < 9; i++) {
      inputs[i].style.color = memomode ? `#808080` : "#000";
    }
  };
  container.appendChild(modechange);

  const clear = document.createElement("input");
  clear.type = "button";
  clear.value = "clear";
  clear.style.fontSize = `${size}px`;
  clear.style.fontWeight = "bold";
  clear.style.position = "absolute";
  clear.style.width = `${size * 3 * 1.4}px`
  clear.style.height = `${size * 2}px`
  clear.style.top = `${size * 3 * 11}px`;
  clear.style.left = `${size * 3 * 3.8}px`;
  clear.onclick = () => {
    if (focus) {
      const [x, y] = focus;
      if (memomode) {
        clear_memo(x, y);
        highlight();
      } else {
        write(x, y, 0);
        highlight();
      }
    }
  };
  container.appendChild(clear);

  const hint = document.createElement("input");
  hint.type = "button";
  hint.value = "hint";
  hint.style.fontSize = `${size}px`;
  hint.style.fontWeight = "bold";
  hint.style.position = "absolute";
  hint.style.width = `${size * 3 * 1.4}px`
  hint.style.height = `${size * 2}px`
  hint.style.top = `${size * 3 * 11}px`;
  hint.style.left = `${size * 3 * 6.8}px`;
  hint.onclick = () => {
    if (focus) {
      if (!solver()) {
        alert("failed");
      } else {
        const [x, y] = focus;
        write(x, y, board[y][x].number);
        number_reset();
        highlight();
      }
    }
  };
  container.appendChild(hint);


  const check = document.createElement("input");
  check.type = "button";
  check.value = "check";
  check.style.fontSize = `${size}px`;
  check.style.fontWeight = "bold";
  check.style.position = "absolute";
  check.style.width = `${size * 3 * 1.4}px`
  check.style.height = `${size * 2}px`
  check.style.top = `${size * 3 * 12}px`;
  check.style.left = `${size * 3 * 0.8}px`;
  check.onclick = () => {
    checker();
  };
  container.appendChild(check);

  const solve = document.createElement("input");
  solve.type = "button";
  solve.value = "solve";
  solve.style.fontSize = `${size}px`;
  solve.style.fontWeight = "bold";
  solve.style.position = "absolute";
  solve.style.width = `${size * 3 * 1.4}px`
  solve.style.height = `${size * 2}px`
  solve.style.top = `${size * 3 * 12}px`;
  solve.style.left = `${size * 3 * 3.8}px`;
  solve.onclick = () => {
    if (!solver()) {
      alert("failed");
    } else {
      for (let gy = 0; gy < 9; gy++) {
        for (let gx = 0; gx < 9; gx++) {
          write(gx, gy, board[gy][gx].number);
        }
      }
    }
  };
  container.appendChild(solve);

  const reset = document.createElement("input");
  reset.type = "button";
  reset.value = "reset";
  reset.style.fontSize = `${size}px`;
  reset.style.fontWeight = "bold";
  reset.style.position = "absolute";
  reset.style.width = `${size * 3 * 1.4}px`
  reset.style.height = `${size * 2}px`
  reset.style.top = `${size * 3 * 12}px`;
  reset.style.left = `${size * 3 * 6.8}px`;
  reset.onclick = () => {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        write(x, y, 0);
      }
    }
    focus = null;
    clear_color();
  };
  container.appendChild(reset);
};

window.onload = () => {
  init();
};
