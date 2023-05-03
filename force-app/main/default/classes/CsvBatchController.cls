public class CsvBatchController implements Database.Batchable<sObject>
{
     private string recordType;
     List<String> csvRowsData=new List<String>();
    // constructor
    public csvBatchController(string recordType,List<String> csvRowsData) {
        this.recordType = recordType;
        this.csvRowsData=csvRowsData;
    } 
   public Iterable<String> start(Database.BatchableContext bc)
    {
        return csvRowsData; //csvRows;
    }
    public void execute(Database.BatchableContext info, List<String> csvRowsData)
    {
        List<list<String>> fieldStr = parseCSV(csvRowsData);

    }
        public void finish(Database.BatchableContext bc) {
    }
    @auraEnabled
    public static List<list<String>> parseCSV(List<String> csvRowsData ) {
        System.debug('rows:: '+csvrowsData);
        List<List<String>> lines = new List<List<String>>();
        if(csvrowsData.size()>0){
            csvrowsData.remove(0);
        }   
        //Handling fields with commas
        for(String line : csvrowsData) {
                List<String> lineBreakup = splitByCommas(line);
                List<String> fields = new List<String>();
                Boolean makeCompositeField = false;
                String compositeField;
                for(String field : lineBreakup) {
                    if (field.startsWith('"') && field.endsWith('"')) {
                        fields.add(field);
                    } else if (field.startsWith('"')) {
                        makeCompositeField = true;
                        compositeField = field;
                    } else if (field.endsWith('"')) {
                        compositeField += ',' + field;
                        fields.add(compositeField);
                        makeCompositeField = false;
                    } else if (makeCompositeField) {
                        compositeField +=  ',' + field;
                    } else {
                        fields.add(field.trim());
                    }
                }
                lines.add(fields);
            } 
            return lines;      
    }
     private static List<String> splitByCommas(String input){
        List<String> results = input.split(',');    
        for(String result : results) {
            result = result.trim();
        }
        return results;
    }
}
