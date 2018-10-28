//
// Weeks and lessons for
// Zen and the art of Radiotelegraphy

var ZenTutor = function() {

    var zt = {};

    zt.enabled = true;

    zt.weeks = {
       1: {
           wpm: 15,
           letters: 'ETANIM',
           days: {
                1:  'TANTE NTENT NMEMN MEEII NMMMN \
                    ETEII EIMNM AAEMM ITENM NAANA \
                    TMTNE AAIET TETNN ITEEE EIENI \
                    TIMIA NNEAT IMNNA MIMIN TINAM \
                    MMENT AMMTE ANTMA EEETT NNIAE',
                2:  'TEAIM AAETN INATE EAINI EITNI\
                    MIETA NTNEE MEEIE IIIAT ENAIA\
                    MAMIT EAMNI ANEIA TTMIM TAAEA\
                    TETAN IMTIA ENNMM NTIAT IEMAI\
                    TEEMN NAEMN NANAN NITMT EMIAA',
                3:  'EINEN AETMI ATTMT NAMIA TMIIT\
                    ETIEE MTIIT MIAIE MTNAM MENNA\
                    IAAMM ETANM ETNMA IETTM NMNAE\
                    ETAAA TATAI NNANN NMEMA ANTET\
                    AENTE EIIAE ANNAI IENTI TTENN',
                4:  'TIAMA INNAA TMINN TTNTA ENITN\
                    TEAAM NTTNA AMEMI NMMMA NMANE\
                    AIIMN TMIEM NNTTI NMTME NMTMN\
                    IEEET AIEIE TETTE NNENN IMINI\
                    INAEE MMTAM ATAMT ANEMA TMMEM',
                5:  'ANATA AMMAM ITIAT IIEEE ATAEM\
                    NAMAM MIETT NIINN IEAEA IMMMN\
                    ITTNM MITTN TIETA TMTMA MITMN\
                    AETET MEMII ITEIE NNIAI TAEET\
                    EITMA MMMNE TMNEN TNTNT MIINT',
                6:  'INIAM AIETI EMAAE AEMEA IIIIE\
                    ANATI MTTAM ITTTI TAEIT TAMMN\
                    ATIIT MEEMM ATTAT MNEMN TNMMI\
                    TTAIE TEIEM AMIMI EETEM METNE\
                    MITIA EIMIN ITMAT IAINT IMETT',
                7:  ' INIAM AIETI EMAAE AEMEA IIIIE\
                    ANATI MTTAM ITTTI TAEIT TAMMN\
                    ATIIT MEEMM ATTAT MNEMN TNMMI\
                    TTAIE TEIEM AMIMI EETEM METNE\
                    MITIA EIMIN ITMAT IAINT IMETT'
           }
       }
   };

  zt.train = function(mg, weekNo, dayNo, displayElement) {
    var week = zt.weeks[weekNo]
      , dayGroups = week.days[dayNo].split(/\s+/);

    zt.enabled = true;

    mg.setWpm(week.wpm);

    function keyGroup() {
      var group = dayGroups.shift();

      if (group && zt.enabled) {
        return mg.key(group + ' ').then(function() {
          if (displayElement) {
            displayElement.append('<span> ' + group + '</span>');
          }

          return keyGroup();
        });
      } else {
        return Promise.reject(null);
      }
    }

    return keyGroup();
   };

   zt.stop = function() {
     zt.enabled = false;
   };

  return zt;
};