public with sharing class CSVReadWriteController {

    @auraenabled
    public static void csvHandler(List<list<String>> csvData){
          system.debug('>>>>>>>csvRows : '+csvData);
        for(List<String> rowdata :csvData ){
            // If a row has data is a list
            if(String.isNotBlank(rowdata.get(5))){
                 list<String> strList=(String.valueOf(rowdata.get(5)).split('-'));
                 system.debug(strList);
             for(string str:strList){
             }
            }  
            }
    }
}