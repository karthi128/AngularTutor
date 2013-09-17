using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AngularTutor.Models
{
    public class Todo
    {
        public int ID { get; set; }
        public string Text { get; set; }
        public DateTime? DueDate { get; set; }
        public int  Priority  { get; set; }

    }
}