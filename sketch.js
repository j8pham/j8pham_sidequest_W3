// A STRANGER IN TOWN - Interactive Story
// Track stats and uncover your true identity through choices

let gameState = {
  currentScene: "intro",
  memory: 0, // How much you remember (0-100)
  trust: 50, // How much townspeople trust you (0-100)
  suspicion: 30, // How suspicious people are of you (0-100)
  inventory: [],
  history: [], // Track choices made
};

let scenes = {
  intro: {
    title: "Awakening",
    text: "You wake up at the train station with no memory. Your pockets are empty except for a worn photograph of this town: Pine Falls. Where are you? Who are you?",
    choices: [
      {
        text: "Head to the nearest building—a small diner",
        next: "diner",
        effects: { memory: 5 },
      },
      {
        text: "Explore the empty platform first",
        next: "platform",
        effects: { memory: 10 },
      },
    ],
  },

  diner: {
    title: "The Diner",
    text: "A warm diner greets you. Behind the counter is MAYA, a kind-looking woman in her 40s. She gasps when she sees you.\n\n'My God... I thought you were... Are you alright?'",
    choices: [
      {
        text: "'Do I know you?' (Honest)",
        next: "diner_honest",
        effects: { memory: 5, trust: 10, suspicion: 5 },
      },
      {
        text: "'I'm just passing through.' (Evasive)",
        next: "diner_evasive",
        effects: { trust: -10, suspicion: 20 },
      },
      {
        text: "'Tell me everything you know.' (Demanding)",
        next: "diner_demand",
        effects: { trust: -20, suspicion: 30 },
      },
    ],
  },

  platform: {
    title: "The Platform",
    text: "You search the platform. Under a bench, you find a train ticket stub with 'PINE FALLS' printed on it and a date from 3 months ago. There's also a locker key (#247). Your hands trembled—you've been here before.",
    choices: [
      {
        text: "Go to the diner for help",
        next: "diner",
        effects: { memory: 15, inventory: ["ticket_stub", "locker_key"] },
      },
      {
        text: "Search for locker #247",
        next: "locker_room",
        effects: { memory: 20, inventory: ["ticket_stub", "locker_key"] },
      },
    ],
  },

  diner_honest: {
    title: "Maya's Story",
    text: "Maya sits you down with coffee. 'You disappeared three months ago. You were investigating something in this town... something dangerous. Then you vanished without a trace. Everyone thought you were dead.'\n\nShe slides you an old newspaper. The headline: 'LOCAL JOURNALIST GOES MISSING'",
    choices: [
      {
        text: "Ask about the investigation",
        next: "investigation_path",
        effects: { memory: 25 },
      },
      {
        text: "Ask about your life before",
        next: "life_before",
        effects: { memory: 20 },
      },
    ],
  },

  diner_evasive: {
    title: "Suspicious Reactions",
    text: "Maya's expression darkens. 'Of course you don't remember me. Or you're lying.' She crosses her arms. 'We heard rumors about you snooping around town three months ago. Then you disappeared. Some people think you ran off. Others think you found something and got silenced.'",
    choices: [
      {
        text: "Apologize and ask for the truth",
        next: "diner_honest",
        effects: { memory: 5, trust: 5 },
      },
      {
        text: "Leave the diner and investigate alone",
        next: "town_square",
        effects: { trust: -15 },
      },
    ],
  },

  diner_demand: {
    title: "Doors Slammed Shut",
    text: "Maya's face hardens. She stands up abruptly. 'I don't know who you are anymore, but you're not the person I knew.' She walks to the back and locks the door. You're alone in the diner. A hand-written note sits on the counter:\n\n'STOP ASKING QUESTIONS. OR ELSE. - THE COUNCIL'",
    choices: [
      {
        text: "Pocket the note and leave",
        next: "town_square",
        effects: { suspicion: 40, memory: 10, inventory: ["threatening_note"] },
      },
      {
        text: "Try to follow Maya",
        next: "diner_confrontation",
        effects: { suspicion: 50 },
      },
    ],
  },

  locker_room: {
    title: "Locker #247",
    text: "You find the locker room at the train station. Locker #247 opens to reveal: an old journal, a stack of newspaper clippings about 'PINE FALLS COUNCIL CORRUPTION', and a photograph of you with someone labeled 'DO NOT TRUST - THE MAYOR'",
    choices: [
      {
        text: "Take everything and head to the diner",
        next: "diner",
        effects: {
          memory: 35,
          inventory: ["journal", "clippings", "mayors_photo"],
        },
      },
      {
        text: "Go directly to confront the mayor",
        next: "mayor_office",
        effects: {
          memory: 35,
          inventory: ["journal", "clippings", "mayors_photo"],
          suspicion: 40,
        },
      },
    ],
  },

  investigation_path: {
    title: "The Corruption Runs Deep",
    text: "'You were investigating the Pine Falls Council,' Maya explains. 'You found evidence of embezzlement, illegal land deals, and worse. You said someone on the council was dangerous. Then... you were gone. Your apartment was ransacked.'",
    choices: [
      {
        text: "Ask for access to your old apartment",
        next: "apartment",
        effects: { memory: 30 },
      },
      {
        text: "Ask which council member is the most dangerous",
        next: "council_suspicion",
        effects: { memory: 25 },
      },
    ],
  },

  life_before: {
    title: "A Life Forgotten",
    text: "'You were a journalist, freelance. You came here to work on a story. You rented a small apartment above the library. You were charming, curious, always asking questions.' Maya's voice grows sad. 'Then something changed. You seemed afraid. You stopped coming by. Then you were gone.'",
    choices: [
      {
        text: "Go to the library and apartment",
        next: "apartment",
        effects: { memory: 20 },
      },
      {
        text: "Ask to see your old notes",
        next: "investigation_path",
        effects: { memory: 15 },
      },
    ],
  },

  town_square: {
    title: "The Watching Eyes",
    text: "You walk through the quiet town square. Shops are closed. People stop and stare at you. One old man whispers to another, then hurries away. There's a police station, town hall, and the library. You feel like you're being watched.",
    choices: [
      {
        text: "Visit the police station",
        next: "police_station",
        effects: { suspicion: 10 },
      },
      {
        text: "Visit the library",
        next: "apartment",
        effects: { suspicion: 5 },
      },
      {
        text: "Confront someone and ask directly what happened",
        next: "confrontation_scene",
        effects: { suspicion: 30 },
      },
    ],
  },

  apartment: {
    title: "Your Old Apartment",
    text: "You find the apartment above the library. The door is slightly ajar. Inside, it's been ransacked, but you find a hidden safe behind a loose wall panel. On the wall, written in red pen: 'YOU KNOW TOO MUCH'",
    choices: [
      {
        text: "Try to open the safe (need a code)",
        next: "safe_puzzle",
        effects: { memory: 25 },
      },
      {
        text: "Leave and take your findings to Maya",
        next: "endgame_good",
        effects: { memory: 20, trust: 30 },
      },
    ],
  },

  safe_puzzle: {
    title: "The Safe",
    text: "The safe has a number lock. You notice scratches around numbers: 4, 7, 1. Your birthday? A date? You try different combinations...",
    choices: [
      {
        text: "4-7-1 (Try in order)",
        next: "safe_open_truth",
        effects: { memory: 40 },
      },
      {
        text: "1-4-7 (Different order)",
        next: "safe_open_partial",
        effects: { memory: 30 },
      },
      {
        text: "Give up and leave",
        next: "town_square",
        effects: { memory: 10 },
      },
    ],
  },

  safe_open_truth: {
    title: "The Whole Truth",
    text: "The safe opens. Inside: evidence of a massive conspiracy. Photos of council members meeting with criminals. Coded messages. A letter addressed to you: 'If you're reading this, you uncovered the truth. The Mayor has ordered your elimination. Trust only Maya. —Your Editor'",
    choices: [
      {
        text: "Go to the police (risky trust)",
        next: "police_reveal",
        effects: { memory: 50 },
      },
      {
        text: "Go to Maya with proof",
        next: "endgame_good",
        effects: { memory: 50, trust: 50 },
      },
    ],
  },

  safe_open_partial: {
    title: "Fragments",
    text: "You open the safe and find documents, but they're partially burned. You can make out mentions of 'illegal operations' and names you can't quite remember. The evidence is incomplete.",
    choices: [
      {
        text: "Find Maya and piece this together",
        next: "investigation_path",
        effects: { memory: 25 },
      },
      {
        text: "Confront the Mayor directly",
        next: "mayor_showdown",
        effects: { memory: 25, suspicion: 50 },
      },
    ],
  },

  police_station: {
    title: "The Police Station",
    text: "You enter. The officer at the desk—SHERIFF COLE—looks shocked. 'You're alive. Didn't expect that.' His hand moves toward his belt. 'You disappeared three months ago. Left a lot of people wondering. Some thought you were dead. Others thought you found your answers.'",
    choices: [
      {
        text: "Ask what he knows about your disappearance",
        next: "sheriff_interrogation",
        effects: { suspicion: 20 },
      },
      {
        text: "Leave immediately",
        next: "town_square",
        effects: { suspicion: 30 },
      },
    ],
  },

  sheriff_interrogation: {
    title: "The Sheriff's Story",
    text: "Sheriff Cole leans back. 'Look, I'm not involved in whatever you uncovered. But people in this town have secrets. Dark ones. You were asking the wrong questions to the wrong people. My advice? Leave and never come back.'",
    choices: [
      {
        text: "Ask who specifically threatened you",
        next: "council_suspicion",
        effects: { memory: 20, trust: 5 },
      },
      {
        text: "Leave and investigate on your own",
        next: "investigation_path",
        effects: { memory: 15 },
      },
    ],
  },

  council_suspicion: {
    title: "The Council Members",
    text: "Maya gives you names: Mayor RICHARD STONE (ambitious, ruthless), Councilwoman HELEN GREY (quiet, manipulative), and Councilman THOMAS WRIGHT (has connections). 'Richard was most interested in silencing you,' Maya says quietly. 'But Helen... Helen scares me more.'",
    choices: [
      {
        text: "Investigate the Mayor's office",
        next: "mayor_office",
        effects: { suspicion: 30 },
      },
      {
        text: "Investigate Helen quietly",
        next: "helen_investigation",
        effects: { memory: 15, suspicion: 20 },
      },
    ],
  },

  mayor_office: {
    title: "The Mayor's Office",
    text: "You break into the town hall. The Mayor's office is pristine—too pristine. There's a safe in the wall, papers on the desk about 'Project Silence', and photographs of people with their faces scratched out. Footsteps approach from the hallway...",
    choices: [
      {
        text: "Hide and wait",
        next: "mayor_confrontation",
        effects: { suspicion: 40 },
      },
      {
        text: "Grab what you can and run",
        next: "escape_scene",
        effects: {
          suspicion: 50,
          memory: 20,
          inventory: ["project_silence_docs"],
        },
      },
    ],
  },

  helen_investigation: {
    title: "Helen's Secret",
    text: "You follow Helen to an old warehouse on the edge of town. Through a window, you see her meeting with someone—a man with a scar. They're discussing 'the journalist problem' and '3 months ago.' You realize Helen might be the real architect of everything.",
    choices: [
      {
        text: "Confront Helen with what you know",
        next: "helen_confrontation",
        effects: { suspicion: 60, memory: 30 },
      },
      {
        text: "Gather more evidence before acting",
        next: "apartment",
        effects: { memory: 25, suspicion: 40 },
      },
    ],
  },

  mayor_confrontation: {
    title: "Face to Face",
    text: "Mayor Stone enters his office and sees you. His expression changes to fury. 'You. I had you taken care of three months ago. How did you—' He reaches for a phone. 'You won't leave this office alive.'",
    choices: [
      {
        text: "Fight and escape",
        next: "escape_scene",
        effects: { suspicion: 80, memory: 40 },
      },
      {
        text: "Try to negotiate",
        next: "mayor_revelation",
        effects: { memory: 35 },
      },
    ],
  },

  mayor_revelation: {
    title: "The Mayor's Confession",
    text: "'Why?' you demand. Stone laughs bitterly. 'You were going to expose everything. But you're the least of my worries. You think this is about money? It's about power. Helen Greene—the councilwoman—she's the real boss. I'm just cleanup.'",
    choices: [
      {
        text: "Leave and confront Helen",
        next: "helen_final_confrontation",
        effects: { memory: 50, trust: 10 },
      },
      {
        text: "Arrest the Mayor yourself (with evidence)",
        next: "endgame_justice",
        effects: { memory: 50, trust: 40 },
      },
    ],
  },

  escape_scene: {
    title: "Running Through the Night",
    text: "You flee into the darkness with the evidence. The town's secrets are in your hands. You can go to the state police, the news, or... you could use this information differently. Power corrupts. What will you do?",
    choices: [
      {
        text: "Go to the state police with evidence",
        next: "endgame_justice",
        effects: { memory: 40, trust: 30 },
      },
      {
        text: "Contact a major newspaper",
        next: "endgame_expose",
        effects: { memory: 45, trust: 20 },
      },
      {
        text: "Use the evidence to gain power in the town",
        next: "endgame_dark",
        effects: { memory: 50, trust: -40, suspicion: 80 },
      },
    ],
  },

  helen_confrontation: {
    title: "Face to Face with Helen",
    text: "Helen smiles when she sees you. 'Clever. You figured it out. But you can't prove anything that won't disappear. And you're still the town's villain—the crazy journalist who vanished for three months. Who would believe you?'",
    choices: [
      {
        text: "Show her the evidence you have",
        next: "endgame_expose",
        effects: { memory: 55, trust: 25 },
      },
      {
        text: "Turn her offer down and go to authorities",
        next: "endgame_justice",
        effects: { memory: 50, trust: 45 },
      },
    ],
  },

  helen_final_confrontation: {
    title: "The Architect",
    text: "Helen listens calmly as you accuse her. 'Yes, I orchestrated your disappearance. You were dangerous. But now you're back, and you know too much. The question is: what are you going to do about it?' She extends her hand. 'Join us. Use what you know. Or...'",
    choices: [
      {
        text: "Refuse and expose everything",
        next: "endgame_expose",
        effects: { memory: 60, trust: 50 },
      },
      {
        text: "Take her hand",
        next: "endgame_dark",
        effects: { memory: 60, trust: -50, suspicion: 100 },
      },
    ],
  },

  diner_confrontation: {
    title: "Maya's Truth",
    text: "You force your way into the back. Maya is on the phone, hanging up quickly. Her eyes are sad. 'I wanted to protect you. But they found you. I'm sorry, but I had to call them.'",
    choices: [
      {
        text: "Flee the diner",
        next: "escape_scene",
        effects: { memory: 20, trust: -50, suspicion: 70 },
      },
    ],
  },

  confrontation_scene: {
    title: "Public Reckoning",
    text: "You grab someone in the street and demand answers. 'Where was I? What happened to me?' Suddenly, you're surrounded by townspeople. Some look afraid. Others angry. The Sheriff appears, hand on his gun.",
    choices: [
      {
        text: "Apologize and back down",
        next: "diner",
        effects: { trust: -10, suspicion: 60 },
      },
      {
        text: "Stand your ground and challenge them",
        next: "endgame_dark",
        effects: { suspicion: 80, memory: 30 },
      },
    ],
  },

  // ENDINGS
  endgame_good: {
    title: "The Truth Prevails",
    text: `ENDING: REDEMPTION\n\nWith Maya's help and the evidence you gathered, you expose the corruption. The state police raid Pine Falls. Mayor Stone is arrested. Councilwoman Helen Greene disappears before she can be caught, but her network falls apart.\n\nYou regain your memory slowly. You were a journalist named ALEX. You came here to expose a conspiracy. You succeeded.\n\nThe town begins to heal. Maya becomes the interim mayor. You decide whether to stay and rebuild, or leave to warn other towns.\n\nFinal Stats:\nMemory: ${gameState.memory}\nTrust: ${gameState.trust}\nSuspicion: ${gameState.suspicion}`,
    choices: [{ text: "Start Over", next: "intro", effects: {} }],
  },

  endgame_justice: {
    title: "Justice Served",
    text: `ENDING: THE WHISTLEBLOWER\n\nYou bring the evidence to the state police. They launch a full investigation. Council members are arrested. A trial follows.\n\nYou testify. Your memory returns fully as you speak the truth under oath. You were ALEX, a journalist who discovered a corruption ring.\n\nThe town is cleaned up. The guilty are punished. You become a hero.\n\nBut is it enough? Helen Greene remains at large. You receive threatening letters. The cost of truth is high.\n\nFinal Stats:\nMemory: ${gameState.memory}\nTrust: ${gameState.trust}\nSuspicion: ${gameState.suspicion}`,
    choices: [{ text: "Start Over", next: "intro", effects: {} }],
  },

  endgame_expose: {
    title: "Headline News",
    text: `ENDING: NATIONAL EXPOSURE\n\nYou contact the state newspaper. They investigate. The story breaks: 'SMALL TOWN'S CORRUPTION RING EXPOSED BY MISSING JOURNALIST'.\n\nYour face is on the front page. Your memory returns: You're ALEX, and you're finally vindicated.\n\nThe scandal goes national. Federal agents get involved. Pine Falls becomes infamous.\n\nYou're offered a book deal, a podcast, speaking engagements. But you feel hollow. You exposed the darkness, but at what cost?\n\nFinal Stats:\nMemory: ${gameState.memory}\nTrust: ${gameState.trust}\nSuspicion: ${gameState.suspicion}`,
    choices: [{ text: "Start Over", next: "intro", effects: {} }],
  },

  endgame_dark: {
    title: "Power Corrupts",
    text: `ENDING: THE DARK PATH\n\nYou use the evidence to seize control. With Helen's backing (or instead of her), you become the new power broker in Pine Falls.\n\nYour memory returns fully. You're ALEX. But ALEX is no longer a journalist seeking truth. You're a puppet master.\n\nThe conspiracy continues—just with different hands at the helm. You become what you swore to destroy.\n\nFinal Stats:\nMemory: ${gameState.memory}\nTrust: ${gameState.trust}\nSuspicion: ${gameState.suspicion}`,
    choices: [{ text: "Start Over", next: "intro", effects: {} }],
  },
};

function setup() {
  createCanvas(800, 600);
  textSize(16);
}

function draw() {
  background(30, 30, 50); // Dark background

  let scene = scenes[gameState.currentScene];

  if (!scene) {
    console.error("Scene not found:", gameState.currentScene);
    return;
  }

  // Display title
  fill(200, 100, 200);
  textSize(32);
  textAlign(CENTER);
  text(scene.title, width / 2, 40);

  // Display story text
  fill(220);
  textSize(16);
  textAlign(LEFT);
  let y = 100;
  let lines = scene.text.split("\n");
  for (let line of lines) {
    text(line, 40, y);
    y += 25;
  }

  // Display stats
  fill(100, 200, 100);
  textSize(12);
  textAlign(LEFT);
  y = height - 90;
  text(`Memory: ${gameState.memory}%`, 20, y);
  text(`Trust: ${gameState.trust}%`, 20, y + 20);
  text(`Suspicion: ${gameState.suspicion}%`, 20, y + 40);

  // Display choices as buttons
  fill(100, 150, 200);
  textSize(14);
  textAlign(CENTER);
  let buttonY = height - 120;
  for (let i = 0; i < scene.choices.length; i++) {
    let choice = scene.choices[i];
    let buttonX = width / 2;
    let buttonWidth = 700;
    let buttonHeight = 35;

    // Draw button
    rect(
      buttonX - buttonWidth / 2,
      buttonY - buttonHeight / 2,
      buttonWidth,
      buttonHeight,
    );

    // Button text
    fill(0);
    text(choice.text, buttonX, buttonY + 5);

    // Store button info for click detection
    choice.x = buttonX - buttonWidth / 2;
    choice.y = buttonY - buttonHeight / 2;
    choice.w = buttonWidth;
    choice.h = buttonHeight;

    fill(100, 150, 200);
    buttonY += 50;
  }
}

function mousePressed() {
  let scene = scenes[gameState.currentScene];

  for (let choice of scene.choices) {
    if (
      mouseX > choice.x &&
      mouseX < choice.x + choice.w &&
      mouseY > choice.y &&
      mouseY < choice.y + choice.h
    ) {
      // Apply effects
      if (choice.effects) {
        gameState.memory += choice.effects.memory || 0;
        gameState.trust += choice.effects.trust || 0;
        gameState.suspicion += choice.effects.suspicion || 0;

        // Clamp values
        gameState.memory = constrain(gameState.memory, 0, 100);
        gameState.trust = constrain(gameState.trust, 0, 100);
        gameState.suspicion = constrain(gameState.suspicion, 0, 100);

        if (choice.effects.inventory) {
          gameState.inventory.push(...choice.effects.inventory);
        }
      }

      // Move to next scene
      gameState.currentScene = choice.next;
      gameState.history.push(choice.text);
      break;
    }
  }
}
