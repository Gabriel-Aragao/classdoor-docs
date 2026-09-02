// Penpot Canvas Generation Script for Classdoor (US01 to US09)
// Executable in Penpot Plugin API context

async function generateClassdoorBoards() {
  const boards = [];
  const startX = 100;
  const startY = 100;
  const boardWidth = 1440;
  const boardHeight = 900;
  const spacingX = 1600;

  // Board 1: Cadastro & Login
  const b1 = penpot.createBoard();
  b1.name = "1. Cadastro e Login (US01 & US02)";
  b1.x = startX;
  b1.y = startY;
  b1.resize(boardWidth, boardHeight);
  b1.fills = [{ fillColor: "#F8F9FA", fillOpacity: 1 }];
  boards.push(b1);

  // Board 2: Home & Busca Global
  const b2 = penpot.createBoard();
  b2.name = "2. Home & Busca Global (US03)";
  b2.x = startX + spacingX;
  b2.y = startY;
  b2.resize(boardWidth, boardHeight);
  b2.fills = [{ fillColor: "#F8F9FA", fillOpacity: 1 }];
  boards.push(b2);

  // Board 3: Perfil Docente & Reviews
  const b3 = penpot.createBoard();
  b3.name = "3. Perfil de Professor & Reviews (US04 & US07)";
  b3.x = startX + spacingX * 2;
  b3.y = startY;
  b3.resize(boardWidth, boardHeight);
  b3.fills = [{ fillColor: "#F8F9FA", fillOpacity: 1 }];
  boards.push(b3);

  // Board 4: Modal de Avaliação
  const b4 = penpot.createBoard();
  b4.name = "4. Modal de Avaliação Anônima & Nominal (US05 & US06)";
  b4.x = startX + spacingX * 3;
  b4.y = startY;
  b4.resize(boardWidth, boardHeight);
  b4.fills = [{ fillColor: "#F8F9FA", fillOpacity: 1 }];
  boards.push(b4);

  // Board 5: Dashboard Docente & Analytics
  const b5 = penpot.createBoard();
  b5.name = "5. Painel Docente & Dashboard (US08 & US09)";
  b5.x = startX + spacingX * 4;
  b5.y = startY;
  b5.resize(boardWidth, boardHeight);
  b5.fills = [{ fillColor: "#F8F9FA", fillOpacity: 1 }];
  boards.push(b5);

  return {
    success: true,
    createdBoards: boards.map(b => ({ id: b.id, name: b.name, x: b.x, y: b.y }))
  };
}

return generateClassdoorBoards();
