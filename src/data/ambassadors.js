export const ambassadors = [
  { name: "Sreeganesh Santhoshraj", college: "TKM College of Engineering", id: "AUR011" },
  { name: "Amal Thomas", college: "Sahrdaya college of engineering", id: "AUR012" },
  { name: "ALBERT jessae Lijoy", college: "Sahrdaya college of engineering and technology", id: "AUR013" },
  { name: "Anoushka manoj", college: "Sahrdaya college of engineering and technology", id: "AUR014" },
  { name: "Celina Elizabeth Robi", college: "Mar Athanasius College of Engineering, Kothamangalam", id: "AUR015" },
  { name: "Abhijith Shaji", college: "Department of Computer Science, CUSAT", id: "AUR016" },
  { name: "Hains Shaju", college: "Cusat kochi", id: "AUR017" },
  { name: "Alif Al Sayed R", college: "TKM College Of Engineering", id: "AUR018" },
  { name: "Milan KB", college: "Sahrdaya CET, kodakara", id: "AUR019" },
  { name: "Arafa N", college: "College of engineering karunagapally", id: "AUR020" },
  { name: "Shuaibur Rahuman S", college: "Mangalam college of Engineering", id: "AUR021" },
  { name: "Sanjana S Nair", college: "GEC Barton Hill", id: "AUR022" },
  { name: "Sahala Mariyam P S", college: "Adi Shankara Institute of Engineering and Technology", id: "AUR023" },
  { name: "Abhinjose JM", college: "College of Engineering Karungappally", id: "AUR024" },
  // Add more ambassadors here if needed
];

export const isValidAmbassadorCode = (code) => {
    return ambassadors.some(ambassador => ambassador.id.toLowerCase() === code.toLowerCase());
};