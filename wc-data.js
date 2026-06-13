/* World Cup 2026 — tournament data
   Source: user-supplied official bracket PDF. */

window.WC = (function () {
  // Each team: name, iso (flagcdn code), code (3-letter), tag (optional)
  const groups = {
    A: { from: "Jun 11", teams: [
      { name: "Mexico", iso: "mx", code: "MEX", tag: "HOST" },
      { name: "South Africa", iso: "za", code: "RSA" },
      { name: "South Korea", iso: "kr", code: "KOR" },
      { name: "Czechia", iso: "cz", code: "CZE" },
    ]},
    B: { from: "Jun 12", teams: [
      { name: "Canada", iso: "ca", code: "CAN", tag: "HOST" },
      { name: "Bosnia & H.", iso: "ba", code: "BIH" },
      { name: "Qatar", iso: "qa", code: "QAT" },
      { name: "Switzerland", iso: "ch", code: "SUI" },
    ]},
    C: { from: "Jun 13", teams: [
      { name: "Brazil", iso: "br", code: "BRA" },
      { name: "Morocco", iso: "ma", code: "MAR" },
      { name: "Haiti", iso: "ht", code: "HAI" },
      { name: "Scotland", iso: "gb-sct", code: "SCO" },
    ]},
    D: { from: "Jun 12", teams: [
      { name: "United States", iso: "us", code: "USA", tag: "HOST" },
      { name: "Paraguay", iso: "py", code: "PAR" },
      { name: "Australia", iso: "au", code: "AUS" },
      { name: "Türkiye", iso: "tr", code: "TUR" },
    ]},
    E: { from: "Jun 14", teams: [
      { name: "Germany", iso: "de", code: "GER" },
      { name: "Curaçao", iso: "cw", code: "CUW" },
      { name: "Côte d'Ivoire", iso: "ci", code: "CIV" },
      { name: "Ecuador", iso: "ec", code: "ECU" },
    ]},
    F: { from: "Jun 14", teams: [
      { name: "Netherlands", iso: "nl", code: "NED" },
      { name: "Japan", iso: "jp", code: "JPN" },
      { name: "Sweden", iso: "se", code: "SWE" },
      { name: "Tunisia", iso: "tn", code: "TUN" },
    ]},
    G: { from: "Jun 15", teams: [
      { name: "Belgium", iso: "be", code: "BEL" },
      { name: "Egypt", iso: "eg", code: "EGY" },
      { name: "Iran", iso: "ir", code: "IRN" },
      { name: "New Zealand", iso: "nz", code: "NZL" },
    ]},
    H: { from: "Jun 15", teams: [
      { name: "Spain", iso: "es", code: "ESP" },
      { name: "Cabo Verde", iso: "cv", code: "CPV" },
      { name: "Saudi Arabia", iso: "sa", code: "KSA" },
      { name: "Uruguay", iso: "uy", code: "URU" },
    ]},
    I: { from: "Jun 16", teams: [
      { name: "France", iso: "fr", code: "FRA" },
      { name: "Senegal", iso: "sn", code: "SEN" },
      { name: "Iraq", iso: "iq", code: "IRQ" },
      { name: "Norway", iso: "no", code: "NOR" },
    ]},
    J: { from: "Jun 16", teams: [
      { name: "Argentina", iso: "ar", code: "ARG", tag: "HOLDERS" },
      { name: "Algeria", iso: "dz", code: "ALG" },
      { name: "Austria", iso: "at", code: "AUT" },
      { name: "Jordan", iso: "jo", code: "JOR" },
    ]},
    K: { from: "Jun 17", teams: [
      { name: "Portugal", iso: "pt", code: "POR" },
      { name: "DR Congo", iso: "cd", code: "COD" },
      { name: "Uzbekistan", iso: "uz", code: "UZB" },
      { name: "Colombia", iso: "co", code: "COL" },
    ]},
    L: { from: "Jun 17", teams: [
      { name: "England", iso: "gb-eng", code: "ENG" },
      { name: "Croatia", iso: "hr", code: "CRO" },
      { name: "Ghana", iso: "gh", code: "GHA" },
      { name: "Panama", iso: "pa", code: "PAN" },
    ]},
  };

  // Knockout matches. slots = [topGuide, bottomGuide]. R32 use group rules.
  // Left side stack order (top->bottom) and right side stack order matter for
  // connector alignment.
  const r32 = {
    73: ["2A", "2B"],
    74: ["1E", "3rd ABCDF"],
    75: ["1F", "2C"],
    76: ["1C", "2F"],
    77: ["1I", "3rd CDFGH"],
    78: ["2E", "2I"],
    79: ["1A", "3rd CEFHI"],
    80: ["1L", "3rd EHIJK"],
    81: ["1D", "3rd BEFIJ"],
    82: ["1G", "3rd AEHIJ"],
    83: ["2K", "2L"],
    84: ["1H", "2J"],
    85: ["1B", "3rd EFGIJ"],
    86: ["1J", "2H"],
    87: ["1K", "3rd DEIJL"],
    88: ["2D", "2G"],
  };

  // Bracket tree, organized by side and column, top->bottom.
  // Each entry: {id, slots:[guideTop, guideBottom]}
  const left = {
    r32: [73 + "", 75 + ""].length ? [
      mk(74, r32), mk(77, r32), mk(73, r32), mk(75, r32),
      mk(83, r32), mk(84, r32), mk(81, r32), mk(82, r32),
    ] : [],
    r16: [ mk(89, { 89: ["W74", "W77"] }), mk(90, { 90: ["W73", "W75"] }),
           mk(93, { 93: ["W83", "W84"] }), mk(94, { 94: ["W81", "W82"] }) ],
    qf:  [ mk(97, { 97: ["W89", "W90"] }), mk(98, { 98: ["W93", "W94"] }) ],
    sf:  [ mk(101, { 101: ["W97", "W98"] }) ],
  };
  const right = {
    r32: [
      mk(76, r32), mk(78, r32), mk(79, r32), mk(80, r32),
      mk(86, r32), mk(88, r32), mk(85, r32), mk(87, r32),
    ],
    r16: [ mk(91, { 91: ["W76", "W78"] }), mk(92, { 92: ["W79", "W80"] }),
           mk(95, { 95: ["W86", "W88"] }), mk(96, { 96: ["W85", "W87"] }) ],
    qf:  [ mk(99, { 99: ["W91", "W92"] }), mk(100, { 100: ["W95", "W96"] }) ],
    sf:  [ mk(102, { 102: ["W99", "W100"] }) ],
  };
  const final = mk(104, { 104: ["W SF1", "W SF2"] });
  const third = mk(103, { 103: ["L SF1", "L SF2"] });

  function mk(id, src) { return { id, slots: src[id] }; }

  const hostCities = [
    { city: "Vancouver", iso: "ca" }, { city: "Seattle", iso: "us" },
    { city: "San Francisco", iso: "us" }, { city: "Los Angeles", iso: "us" },
    { city: "Guadalajara", iso: "mx" }, { city: "Mexico City", iso: "mx" },
    { city: "Monterrey", iso: "mx" }, { city: "Houston", iso: "us" },
    { city: "Dallas", iso: "us" }, { city: "Kansas City", iso: "us" },
    { city: "Atlanta", iso: "us" }, { city: "Miami", iso: "us" },
    { city: "Toronto", iso: "ca" }, { city: "Boston", iso: "us" },
    { city: "Philadelphia", iso: "us" }, { city: "New York / NJ", iso: "us" },
  ];

  const dates = [
    { label: "Opening Match", val: "Jun 11", place: "Mexico City" },
    { label: "Round of 32", val: "Jun 28", place: "Knockouts" },
    { label: "Third Place", val: "Jul 18", place: "Miami" },
    { label: "Final", val: "Jul 19", place: "MetLife · NJ" },
  ];

  const hosts = [
    { name: "United States", iso: "us" },
    { name: "Canada", iso: "ca" },
    { name: "Mexico", iso: "mx" },
  ];

  return { groups, left, right, final, third, hostCities, dates, hosts };
})();
